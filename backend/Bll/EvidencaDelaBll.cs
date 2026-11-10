using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.Bll.Models;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.DTO.DelovniNalogi;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Bll;

public class EvidencaDelaBll(AppDbContext context)
{
    public async Task<EvidencaDelaDto?> PridobiAsync(int nalogId, DostopDoNalogov dostop, CancellationToken cancellationToken = default)
    {
        return await context.DelovniNalogi
            .AsNoTracking()
            .Where(x =>
                x.Id == nalogId &&
                (dostop.JeOrganizator ||
                    (dostop.JeIzvajalec && x.IzvajalecId == dostop.UporabnikId)))
            .Select(x => new EvidencaDelaDto
            {
                DelovniNalogId = x.Id,
                OpravljeneUre = x.OpravljeneUre,
                OpisIzvedbe = x.OpisIzvedbe,
                RazlogDopolnitve = x.RazlogDopolnitve,
                Status = x.Status,
                DejanskiZacetek = x.DejanskiZacetek,
                DejanskiKonec = x.DejanskiKonec,
            })
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<EvidencaDelaRezultat> ShraniAsync(int nalogId, int izvajalecId, ShraniEvidencoDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.OpravljeneUre is decimal ure && !SoUreVeljavne(ure))
            return EvidencaDelaRezultat.NeveljavneUre;

        var opis = string.IsNullOrWhiteSpace(dto.OpisIzvedbe)
            ? null
            : dto.OpisIzvedbe.Trim();

        var spremenjeno = await UredljiviNalogi(nalogId, izvajalecId)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.OpravljeneUre, dto.OpravljeneUre)
                .SetProperty(x => x.OpisIzvedbe, opis),
                cancellationToken);

        if (spremenjeno == 1)
            return EvidencaDelaRezultat.Uspeh;

        return await RezultatBrezSpremembeAsync(
            nalogId, izvajalecId, oddaja: false, cancellationToken);
    }

    public async Task<EvidencaDelaRezultat> OddajAsync(int nalogId, int izvajalecId, OddajEvidencoDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.OpravljeneUre is not decimal ure || !SoUreVeljavne(ure))
            return EvidencaDelaRezultat.NeveljavneUre;

        if (string.IsNullOrWhiteSpace(dto.OpisIzvedbe))
            return EvidencaDelaRezultat.ManjkajocOpis;

        var opis = dto.OpisIzvedbe.Trim();

        var spremenjeno = await UredljiviNalogi(nalogId, izvajalecId)
            .Where(x =>
                x.DejanskiZacetek != null &&
                x.DejanskiKonec != null &&
                x.DejanskiKonec.Value >= x.DejanskiZacetek.Value)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.OpravljeneUre, (decimal?)ure)
                .SetProperty(x => x.OpisIzvedbe, opis)
                .SetProperty(x => x.Status, StatusDelovnegaNaloga.CakaNaPregled),
                cancellationToken);

        if (spremenjeno == 1)
            return EvidencaDelaRezultat.Uspeh;

        return await RezultatBrezSpremembeAsync(
            nalogId, izvajalecId, oddaja: true, cancellationToken);
    }

    private IQueryable<DelovniNalog> UredljiviNalogi(int nalogId, int izvajalecId)
    {
        return context.DelovniNalogi.Where(x =>
            x.Id == nalogId &&
            x.IzvajalecId == izvajalecId &&
            (x.Status == StatusDelovnegaNaloga.VIzvajanju ||
                x.Status == StatusDelovnegaNaloga.VDopolnitvi));
    }

    private static bool SoUreVeljavne(decimal ure)
    {
        return ure > 0m && ure <= 1000m;
    }

    private async Task<EvidencaDelaRezultat> RezultatBrezSpremembeAsync(int nalogId, int izvajalecId, bool oddaja, CancellationToken cancellationToken)
    {
        var nalog = await context.DelovniNalogi
            .AsNoTracking()
            .Where(x => x.Id == nalogId && x.IzvajalecId == izvajalecId)
            .Select(x => new
            {
                x.Status,
                x.DejanskiZacetek,
                x.DejanskiKonec
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (nalog is null)
            return EvidencaDelaRezultat.NalogNeObstaja;

        if (nalog.Status != StatusDelovnegaNaloga.VIzvajanju &&
            nalog.Status != StatusDelovnegaNaloga.VDopolnitvi)
        {
            return EvidencaDelaRezultat.NeveljavnoStanje;
        }

        if (oddaja &&
            (nalog.DejanskiZacetek == null ||
                nalog.DejanskiKonec == null ||
                nalog.DejanskiKonec.Value < nalog.DejanskiZacetek.Value))
        {
            return EvidencaDelaRezultat.NeveljavenPotek;
        }

        return EvidencaDelaRezultat.NeveljavnoStanje;
    }
}