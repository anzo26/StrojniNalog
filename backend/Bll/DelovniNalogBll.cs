using Microsoft.EntityFrameworkCore;
using Npgsql;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.Bll.Results;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.DTO.DelovniNalogi;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Bll;

public class DelovniNalogBll(AppDbContext context, IzvajalecBll izvajalecBll, ZasedenostBll zasedenostBll)
{
    public async Task<PripravaNalogaOdgovor> PripraviAsync(PripraviDelovniNalogDto dto, CancellationToken cancellationToken = default)
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

        var zasedenost = await zasedenostBll.PreveriAsync(
            dto.StrojId,
            dto.IzvajalecId,
            zacetek.UtcDateTime,
            konec.UtcDateTime,
            cancellationToken);

        if (zasedenost.JeZaseden)
            return new(PripravaNalogaRezultat.TerminZaseden, Zasedenost: zasedenost);

        var nalog = new DelovniNalog
        {
            NarociloId = dto.NarociloId,
            StrojId = dto.StrojId,
            IzvajalecId = dto.IzvajalecId,
            PredvideniZacetek = zacetek.UtcDateTime,
            PredvideniKonec = konec.UtcDateTime,
            Status = StatusDelovnegaNaloga.Nacrtovan
        };

        return await ShraniAsync(nalog, cancellationToken);
    }

    
    private async Task<PripravaNalogaOdgovor> ShraniAsync(DelovniNalog nalog,CancellationToken cancellationToken)
    {
        context.DelovniNalogi.Add(nalog);

        for (var poskus = 0; poskus < 2; poskus++)
        {
            try
            {
                await context.SaveChangesAsync(cancellationToken);

                return new(
                    PripravaNalogaRezultat.Uspeh,
                    new PripravljenDelovniNalogDto
                    {
                        Id = nalog.Id,
                        Status = nalog.Status
                    });
            }
            catch (DbUpdateException ex) when (
                poskus == 0 &&
                ex.InnerException is PostgresException
                {
                    SqlState: PostgresErrorCodes.DeadlockDetected
                })
            {
                // Po razveljavitvi transakcije enkrat ponovimo shranjevanje.
                continue;
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
            catch (DbUpdateException ex) when (
                ex.InnerException is PostgresException postgres &&
                postgres.SqlState == PostgresErrorCodes.ExclusionViolation &&
                postgres.ConstraintName is
                    ZasedenostBll.StrojConstraint or ZasedenostBll.IzvajalecConstraint)
            {
                context.Entry(nalog).State = EntityState.Detached;

                var konflikt = await zasedenostBll.PreveriAsync(
                    nalog.StrojId,
                    nalog.IzvajalecId,
                    nalog.PredvideniZacetek,
                    nalog.PredvideniKonec,
                    cancellationToken);

                var potrjenKonflikt = konflikt with
                {
                    StrojZaseden = konflikt.StrojZaseden ||
                        postgres.ConstraintName == ZasedenostBll.StrojConstraint,
                    IzvajalecZaseden = konflikt.IzvajalecZaseden ||
                        postgres.ConstraintName == ZasedenostBll.IzvajalecConstraint
                };

                return new(
                    PripravaNalogaRezultat.TerminZaseden,
                    Zasedenost: potrjenKonflikt);
            }
        }

        throw new InvalidOperationException("Shranjevanje naloga se ni zaključilo.");
    }
}