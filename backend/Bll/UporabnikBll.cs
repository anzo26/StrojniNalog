using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Bll;

public class UporabnikBll(AppDbContext context)
{
    public Task<Uporabnik> PridobiAliUstvariAsync(ClaimsPrincipal principal,CancellationToken cancellationToken = default)
    {
        var authId = principal.FindFirstValue("sub");

        if (principal.Identity?.IsAuthenticated != true || string.IsNullOrWhiteSpace(authId))
            throw new UnauthorizedAccessException("Manjka overjena identiteta uporabnika.");

        return PridobiAliUstvariAsync(
            authId,
            principal.FindFirstValue("given_name"),
            principal.FindFirstValue("family_name"),
            principal.FindFirstValue("email"),
            cancellationToken);
    }

    public async Task<Uporabnik> PridobiAliUstvariAsync(string authId,string? ime,string? priimek,string? email,CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(authId);

        var obstojeci = await context.Uporabniki
            .SingleOrDefaultAsync(x => x.AuthId == authId, cancellationToken);

        if (obstojeci is not null)
            return obstojeci;

        var uporabnik = new Uporabnik
        {
            AuthId = authId,
            Ime = ime ?? string.Empty,
            Priimek = priimek ?? string.Empty,
            Email = email ?? string.Empty
        };

        context.Uporabniki.Add(uporabnik);

        try
        {
            await context.SaveChangesAsync(cancellationToken);
            return uporabnik;
        }
        catch (DbUpdateException ex) when (
            ex.InnerException is PostgresException
            {
                SqlState: PostgresErrorCodes.UniqueViolation,
                ConstraintName: "IX_Uporabniki_AuthId"
            })
        {
            context.Entry(uporabnik).State = EntityState.Detached;

            return await context.Uporabniki
                .SingleAsync(x => x.AuthId == authId, cancellationToken);
        }
    }
}