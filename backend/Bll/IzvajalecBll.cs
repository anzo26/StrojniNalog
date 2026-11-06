using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.DTOs.Uporabniki;
using StrojniNalog.Api.Integrations.Keycloak;

namespace StrojniNalog.Api.Bll;

public class IzvajalecBll(AppDbContext context,KeycloakAdminClient keycloakClient,UporabnikBll uporabnikBll)
{
    public async Task<List<IzvajalecDto>> PridobiAsync(
        CancellationToken cancellationToken = default)
    {
        var izvajalci = await keycloakClient.PridobiIzvajalceAsync(cancellationToken);

        if (izvajalci.Count == 0)
            return [];

        var authIds = izvajalci.Select(x => x.Id).ToArray();

        var lokalniUporabniki = await context.Uporabniki
            .AsNoTracking()
            .Where(x => authIds.Contains(x.AuthId))
            .ToDictionaryAsync(x => x.AuthId, cancellationToken);

        var rezultat = new List<IzvajalecDto>();

        foreach (var izvajalec in izvajalci)
        {
            if (!lokalniUporabniki.TryGetValue(izvajalec.Id, out var uporabnik))
            {
                uporabnik = await uporabnikBll.PridobiAliUstvariAsync(
                    authId: izvajalec.Id,
                    ime: izvajalec.FirstName,
                    priimek: izvajalec.LastName,
                    email: izvajalec.Email,
                    cancellationToken: cancellationToken);
            }

            rezultat.Add(new IzvajalecDto
            {
                Id = uporabnik.Id,
                Ime = izvajalec.FirstName ?? string.Empty,
                Priimek = izvajalec.LastName ?? string.Empty,
                Email = izvajalec.Email ?? string.Empty
            });
        }

        return rezultat
            .OrderBy(x => x.Priimek)
            .ThenBy(x => x.Ime)
            .ThenBy(x => x.Id)
            .ToList();
    }

    public async Task<bool> JeAktivenIzvajalecAsync(
        int uporabnikId,
        CancellationToken cancellationToken = default)
    {
        var authId = await context.Uporabniki
            .AsNoTracking()
            .Where(x => x.Id == uporabnikId)
            .Select(x => x.AuthId)
            .SingleOrDefaultAsync(cancellationToken);

        if (string.IsNullOrWhiteSpace(authId))
            return false;

        return await keycloakClient.PridobiIzvajalcaAsync(authId, cancellationToken) is not null;
    }
}