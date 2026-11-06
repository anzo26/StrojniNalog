using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Options;
using StrojniNalog.Api.Integrations.Keycloak.Models;

namespace StrojniNalog.Api.Integrations.Keycloak;

public sealed class KeycloakTokenProvider(IHttpClientFactory httpClientFactory,IOptions<KeycloakAdminOptions> options) : IDisposable
{
    private readonly KeycloakAdminOptions nastavitve = options.Value;
    private readonly SemaphoreSlim zaklep = new(1, 1);
    private string? zeton;
    private DateTimeOffset uporabenDo = DateTimeOffset.MinValue;

    public async Task<string> PridobiAsync(CancellationToken cancellationToken = default)
    {
        await zaklep.WaitAsync(cancellationToken);

        try
        {
            if (zeton is not null && DateTimeOffset.UtcNow < uporabenDo)
                return zeton;

            using var client = httpClientFactory.CreateClient(KeycloakAdminOptions.SectionName);
            using var vsebina = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "client_credentials",
                ["client_id"] = nastavitve.ClientId,
                ["client_secret"] = nastavitve.ClientSecret
            });

            var realm = Uri.EscapeDataString(nastavitve.Realm);
            var pot = $"realms/{realm}/protocol/openid-connect/token";
            var zacetek = DateTimeOffset.UtcNow;

            using var response = await client.PostAsync(pot, vsebina, cancellationToken);

            if (!response.IsSuccessStatusCode)
                throw new KeycloakException(
                    $"Pridobivanje servisnega žetona ni uspelo (HTTP {(int)response.StatusCode}).");

            var odgovor = await response.Content
                .ReadFromJsonAsync<KeycloakTokenResponse>(cancellationToken);

            if (odgovor is null || string.IsNullOrWhiteSpace(odgovor.AccessToken) || odgovor.ExpiresIn <= 0)
                throw new KeycloakException("Keycloak je vrnil neveljaven odgovor za servisni žeton.");

            var rezerva = Math.Min(30, odgovor.ExpiresIn / 10.0);
            var noviRok = zacetek.AddSeconds(odgovor.ExpiresIn - rezerva);

            if (noviRok <= DateTimeOffset.UtcNow)
                throw new KeycloakException("Prejeti servisni žeton nima dovolj preostale veljavnosti.");

            zeton = odgovor.AccessToken;
            uporabenDo = noviRok;

            return zeton;
        }
        catch (Exception exception) when (exception is HttpRequestException or JsonException ||
            (exception is OperationCanceledException && !cancellationToken.IsCancellationRequested))
        {
            throw new KeycloakException("Komunikacija s Keycloakom ni uspela.", exception);
        }
        finally
        {
            zaklep.Release();
        }
    }

    public async Task RazveljaviAsync(string zavrnjenZeton, CancellationToken cancellationToken = default)
    {
        await zaklep.WaitAsync(cancellationToken);

        try
        {
            if (zeton == zavrnjenZeton)
            {
                zeton = null;
                uporabenDo = DateTimeOffset.MinValue;
            }
        }
        finally
        {
            zaklep.Release();
        }
    }

    public void Dispose() => zaklep.Dispose();
}