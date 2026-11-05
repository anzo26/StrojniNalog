using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.DTOs.Narocila;
using StrojniNalog.Api.DTOs.Storitve;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Bll;

public class NarociloBll(AppDbContext context)
{
    public async Task<List<VrstaStoritveDto>> PridobiAktivneStoritveAsync(CancellationToken cancellationToken = default)
    {
        return await context.VrsteStoritev
            .AsNoTracking()
            .Where(x => x.Aktivna)
            .OrderBy(x => x.Naziv)
            .Select(x => new VrstaStoritveDto
            {
                Id = x.Id,
                Naziv = x.Naziv,
                Opis = x.Opis
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<OddanoNarociloDto?> OddajAsync(UstvariNarociloDto dto,int narocnikId,CancellationToken cancellationToken = default)
    {
        var termin = dto.ZeleniTermin ?? throw new ArgumentException("Želeni termin mora biti podan.", nameof(dto));

        var storitevAktivna = await context.VrsteStoritev
            .AnyAsync(x => x.Id == dto.VrstaStoritveId && x.Aktivna, cancellationToken);

        if (!storitevAktivna)
            return null;

        var narocilo = new Narocilo
        {
            NarocnikId = narocnikId,
            VrstaStoritveId = dto.VrstaStoritveId,
            OpisDela = dto.OpisDela.Trim(),
            Lokacija = dto.Lokacija.Trim(),
            ZeleniTermin = termin.UtcDateTime,
            DatumOddaje = DateTime.UtcNow,
            Status = StatusNarocila.Oddano
        };

        context.Narocila.Add(narocilo);
        await context.SaveChangesAsync(cancellationToken);

        return new OddanoNarociloDto
        {
            Id = narocilo.Id,
            Status = narocilo.Status.ToString().ToUpperInvariant(),
            DatumOddaje = narocilo.DatumOddaje
        };
    }
}