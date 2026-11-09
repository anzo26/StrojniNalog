using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Bll.Models;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.DTO.DelovniNalogi;
using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Bll;

public class DelovniNalogPregledBll(AppDbContext context)
{
    public async Task<List<DelovniNalogSeznamDto>> PridobiSeznamAsync(
        DostopDoNalogov dostop,
        CancellationToken cancellationToken = default)
    {
        return await DostopniNalogi(dostop)
            .OrderBy(x => x.PredvideniZacetek)
            .ThenBy(x => x.Id)
            .Select(x => new DelovniNalogSeznamDto
            {
                Id = x.Id,
                NarociloId = x.NarociloId,
                Stroj = x.Stroj.Oznaka + " – " + x.Stroj.Naziv,
                Izvajalec = (x.Izvajalec.Ime + " " + x.Izvajalec.Priimek).Trim(),
                PredvideniZacetek = x.PredvideniZacetek,
                PredvideniKonec = x.PredvideniKonec,
                DejanskiZacetek = x.DejanskiZacetek,
                DejanskiKonec = x.DejanskiKonec,
                Status = x.Status
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<DelovniNalogPodrobnostiDto?> PridobiPodrobnostiAsync(
        int id,
        DostopDoNalogov dostop,
        CancellationToken cancellationToken = default)
    {
        return await DostopniNalogi(dostop)
            .Where(x => x.Id == id)
            .Select(x => new DelovniNalogPodrobnostiDto
            {
                Id = x.Id,
                NarociloId = x.NarociloId,
                StrojId = x.StrojId,
                Stroj = x.Stroj.Oznaka + " – " + x.Stroj.Naziv,
                IzvajalecId = x.IzvajalecId,
                Izvajalec = (x.Izvajalec.Ime + " " + x.Izvajalec.Priimek).Trim(),
                PredvideniZacetek = x.PredvideniZacetek,
                PredvideniKonec = x.PredvideniKonec,
                DejanskiZacetek = x.DejanskiZacetek,
                DejanskiKonec = x.DejanskiKonec,
                Status = x.Status
            })
            .SingleOrDefaultAsync(cancellationToken);
    }

    private IQueryable<DelovniNalog> DostopniNalogi(DostopDoNalogov dostop)
    {
        return context.DelovniNalogi
            .AsNoTracking()
            .Where(x =>
                dostop.JeOrganizator ||
                (dostop.JeIzvajalec && x.IzvajalecId == dostop.UporabnikId) ||
                (dostop.JeNarocnik && x.Narocilo.NarocnikId == dostop.UporabnikId));
    }
}