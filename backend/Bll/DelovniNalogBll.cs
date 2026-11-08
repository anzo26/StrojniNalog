using Microsoft.EntityFrameworkCore;
using Npgsql;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.Bll.Results;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.DTOs.DelovniNalogi;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Bll;

public class DelovniNalogBll(AppDbContext context, IzvajalecBll izvajalecBll)
{
    public async Task<PripravaNalogaOdgovor> PripraviAsync(PripraviDelovniNalogDto dto,CancellationToken cancellationToken = default)
    {
        if (dto.PredvideniZacetek is not DateTimeOffset zacetek ||
            dto.PredvideniKonec is not DateTimeOffset konec ||
            konec <= zacetek)
        {
            return new(PripravaNalogaRezultat.NeveljavenTermin);
        }

        var narocilo = await context.Narocila
            .AsNoTracking()
            .Where(x => x.Id == dto.NarociloId)
            .Select(x => new
            {
                x.Status,
                ImaNalog = x.DelovniNalog != null
            })
            .SingleOrDefaultAsync(cancellationToken);

        if (narocilo is null)
            return new(PripravaNalogaRezultat.NarociloNeObstaja);

        if (narocilo.Status != StatusNarocila.Potrjeno)
            return new(PripravaNalogaRezultat.NarociloNiPotrjeno);

        if (narocilo.ImaNalog)
            return new(PripravaNalogaRezultat.NalogZeObstaja);

        var strojJeRazpolozljiv = await context.Stroji
            .AnyAsync(x => x.Id == dto.StrojId && x.Razpolozljiv, cancellationToken);

        if (!strojJeRazpolozljiv)
            return new(PripravaNalogaRezultat.NeveljavenStroj);

        var jeIzvajalec = await izvajalecBll
            .JeAktivenIzvajalecAsync(dto.IzvajalecId, cancellationToken);

        if (!jeIzvajalec)
            return new(PripravaNalogaRezultat.NeveljavenIzvajalec);

        var nalog = new DelovniNalog
        {
            NarociloId = dto.NarociloId,
            StrojId = dto.StrojId,
            IzvajalecId = dto.IzvajalecId,
            PredvideniZacetek = zacetek.UtcDateTime,
            PredvideniKonec = konec.UtcDateTime,
            Status = StatusDelovnegaNaloga.Nacrtovan
        };

        context.DelovniNalogi.Add(nalog);

        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException ex) when (
            ex.InnerException is PostgresException
            {
                SqlState: PostgresErrorCodes.UniqueViolation,
                ConstraintName: "IX_DelovniNalogi_NarociloId"
            })
        {
            context.Entry(nalog).State = EntityState.Detached;
            return new(PripravaNalogaRezultat.NalogZeObstaja);
        }

        return new(
            PripravaNalogaRezultat.Uspeh,
            new PripravljenDelovniNalogDto
            {
                Id = nalog.Id,
                Status = nalog.Status
            });
    }

    public async Task<DelovniNalogPodrobnostiDto?> PridobiPodrobnostiAsync(int id,CancellationToken cancellationToken = default)
{
    return await context.DelovniNalogi
        .AsNoTracking()
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
            Status = x.Status
        })
        .SingleOrDefaultAsync(cancellationToken);
}
}