using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using StrojniNalog.Api.Integrations.Keycloak.Models;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Integrations.Keycloak;

public class KeycloakAdminClient(IHttpClientFactory httpClientFactory,KeycloakTokenProvider tokenProvider,IOptions<KeycloakAdminOptions> options)
{
    private const int VelikostStrani = 100;
    private readonly string realm = Uri.EscapeDataString(options.Value.Realm);

    public async Task<List<KeycloakUporabnik>> PridobiIzvajalceAsync(
        CancellationToken cancellationToken = default)
    {
        var izvajalci = new List<KeycloakUporabnik>();
        var vloga = Uri.EscapeDataString(AppRoles.Izvajalec);

        for (var first = 0; ; first += VelikostStrani)
        {
            var pot = $"admin/realms/{realm}/roles/{vloga}/users?first={first}&max={VelikostStrani}";

            var stran = await PridobiAsync<List<KeycloakUporabnik>>(pot, cancellationToken)
                ?? throw new KeycloakException("Realm ali vloga izvajalca v Keycloaku ne obstaja.");

            izvajalci.AddRange(stran.Where(JeAktivenUporabnik));

            if (stran.Count < VelikostStrani)
                break;
        }

        return izvajalci.DistinctBy(x => x.Id).ToList();
    }

    public async Task<KeycloakUporabnik?> PridobiIzvajalcaAsync(
        string authId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(authId))
            return null;

        var uporabnikId = Uri.EscapeDataString(authId);
        var pot = $"admin/realms/{realm}/users/{uporabnikId}";

        var uporabnik = await PridobiAsync<KeycloakUporabnik>(pot, cancellationToken);

        if (uporabnik is null || !JeAktivenUporabnik(uporabnik))
            return null;

        var vloge = await PridobiAsync<List<KeycloakVloga>>(
            $"{pot}/role-mappings/realm/composite", cancellationToken);

        return vloge?.Any(x => x.Name == AppRoles.Izvajalec) == true
            ? uporabnik
            : null;
    }

    private static bool JeAktivenUporabnik(KeycloakUporabnik uporabnik)
    {
        return uporabnik.Enabled &&
            !string.IsNullOrWhiteSpace(uporabnik.Id) &&
            string.IsNullOrEmpty(uporabnik.ServiceAccountClientId);
    }

    private async Task<T?> PridobiAsync<T>(
        string pot,
        CancellationToken cancellationToken) where T : class
    {
        try
        {
            using var client = httpClientFactory.CreateClient(KeycloakAdminOptions.SectionName);

            for (var poskus = 0; poskus < 2; poskus++)
            {
                var zeton = await tokenProvider.PridobiAsync(cancellationToken);

                using var request = new HttpRequestMessage(HttpMethod.Get, pot);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", zeton);

                using var response = await client.SendAsync(request, cancellationToken);

                if (response.StatusCode == HttpStatusCode.Unauthorized && poskus == 0)
                {
                    await tokenProvider.RazveljaviAsync(zeton, cancellationToken);
                    continue;
                }

                if (response.StatusCode == HttpStatusCode.NotFound)
                    return null;

                if (!response.IsSuccessStatusCode)
                    throw new KeycloakException(
                        $"Branje podatkov iz Keycloaka ni uspelo (HTTP {(int)response.StatusCode}).");

                return await response.Content.ReadFromJsonAsync<T>(cancellationToken)
                    ?? throw new KeycloakException("Keycloak je vrnil prazen odgovor.");
            }

            throw new KeycloakException("Ponovna prijava servisnega računa ni uspela.");
        }
        catch (Exception exception) when (
            exception is HttpRequestException or JsonException ||
            (exception is OperationCanceledException && !cancellationToken.IsCancellationRequested))
        {
            throw new KeycloakException("Komunikacija s Keycloakom ni uspela.", exception);
        }
    }
}