using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Bll;

public class ObravnavaEvidenceBll(AppDbContext context)
{
    public async Task<ObravnavaEvidenceRezultat> PotrdiAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var spremenjenih = await context.DelovniNalogi
            .Where(x => x.Id == id &&
                x.Status == StatusDelovnegaNaloga.CakaNaPregled)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.Status, StatusDelovnegaNaloga.Zakljucen)
                .SetProperty(x => x.RazlogDopolnitve, (string?)null),
                cancellationToken);

        return await DolociRezultatAsync(id, spremenjenih, cancellationToken);
    }

    public async Task<ObravnavaEvidenceRezultat> VrniAsync(
        int id,
        string? razlog,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(razlog))
            return ObravnavaEvidenceRezultat.ManjkajocRazlog;

        var urejenRazlog = razlog.Trim();

        var spremenjenih = await context.DelovniNalogi
            .Where(x => x.Id == id &&
                x.Status == StatusDelovnegaNaloga.CakaNaPregled)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.Status, StatusDelovnegaNaloga.VDopolnitvi)
                .SetProperty(x => x.RazlogDopolnitve, urejenRazlog),
                cancellationToken);

        return await DolociRezultatAsync(id, spremenjenih, cancellationToken);
    }

    private async Task<ObravnavaEvidenceRezultat> DolociRezultatAsync(
        int id,
        int spremenjenih,
        CancellationToken cancellationToken)
    {
        if (spremenjenih == 1)
            return ObravnavaEvidenceRezultat.Uspeh;

        var obstaja = await context.DelovniNalogi
            .AnyAsync(x => x.Id == id, cancellationToken);

        return obstaja
            ? ObravnavaEvidenceRezultat.NeveljavnoStanje
            : ObravnavaEvidenceRezultat.NalogNeObstaja;
    }
}