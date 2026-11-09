using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Bll;

public class PotekIzvedbeBll(AppDbContext context)
{
    public async Task<BelezenjePotekaRezultat> ZabeleziZacetekAsync(
        int nalogId,
        int izvajalecId,
        CancellationToken cancellationToken = default)
    {
        var zacetek = DateTime.UtcNow;

        var spremenjeno = await context.DelovniNalogi
            .Where(x =>
                x.Id == nalogId &&
                x.IzvajalecId == izvajalecId &&
                x.Status == StatusDelovnegaNaloga.Nacrtovan &&
                x.DejanskiZacetek == null &&
                x.DejanskiKonec == null)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.DejanskiZacetek, (DateTime?)zacetek)
                .SetProperty(x => x.Status, StatusDelovnegaNaloga.VIzvajanju),
                cancellationToken);

        if (spremenjeno == 1)
            return BelezenjePotekaRezultat.Uspeh;

        return await RezultatBrezSpremembeAsync(nalogId, izvajalecId, cancellationToken);
    }

    public async Task<BelezenjePotekaRezultat> ZabeleziKonecAsync(
        int nalogId,
        int izvajalecId,
        CancellationToken cancellationToken = default)
    {
        var konec = DateTime.UtcNow;

        var spremenjeno = await context.DelovniNalogi
            .Where(x =>
                x.Id == nalogId &&
                x.IzvajalecId == izvajalecId &&
                x.Status == StatusDelovnegaNaloga.VIzvajanju &&
                x.DejanskiZacetek != null &&
                x.DejanskiZacetek.Value <= konec &&
                x.DejanskiKonec == null)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.DejanskiKonec, (DateTime?)konec),
                cancellationToken);

        if (spremenjeno == 1)
            return BelezenjePotekaRezultat.Uspeh;

        return await RezultatBrezSpremembeAsync(nalogId, izvajalecId, cancellationToken);
    }

    private async Task<BelezenjePotekaRezultat> RezultatBrezSpremembeAsync(
        int nalogId,
        int izvajalecId,
        CancellationToken cancellationToken)
    {
        var jeDodeljen = await context.DelovniNalogi
            .AnyAsync(x => x.Id == nalogId && x.IzvajalecId == izvajalecId, cancellationToken);

        return jeDodeljen
            ? BelezenjePotekaRezultat.NeveljavnoStanje
            : BelezenjePotekaRezultat.NalogNeObstaja;
    }
}