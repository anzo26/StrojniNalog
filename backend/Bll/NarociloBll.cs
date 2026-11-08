using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.DTO.Narocila;
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

    public async Task<OddanoNarociloDto?> OddajAsync(UstvariNarociloDto dto, int narocnikId, CancellationToken cancellationToken = default)
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
            Status = narocilo.Status,
            DatumOddaje = narocilo.DatumOddaje
        };
    }

    public async Task<List<NarociloSeznamDto>> PridobiSeznamAsync(int uporabnikId,bool jeOrganizator,CancellationToken cancellationToken = default)
    {
        return await DostopnaNarocila(uporabnikId, jeOrganizator)
            .OrderByDescending(x => x.DatumOddaje)
            .ThenByDescending(x => x.Id)
            .Select(x => new NarociloSeznamDto
            {
                Id = x.Id,
                Narocnik = (x.Narocnik.Ime + " " + x.Narocnik.Priimek).Trim(),
                VrstaStoritve = x.VrstaStoritve.Naziv,
                ZeleniTermin = x.ZeleniTermin,
                DatumOddaje = x.DatumOddaje,
                Status = x.Status
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<NarociloPodrobnostiDto?> PridobiPodrobnostiAsync(int narociloId,int uporabnikId,bool jeOrganizator,CancellationToken cancellationToken = default)
    {
        return await DostopnaNarocila(uporabnikId, jeOrganizator)
            .Where(x => x.Id == narociloId)
            .Select(x => new NarociloPodrobnostiDto
            {
                Id = x.Id,
                NarocnikId = x.NarocnikId,
                Narocnik = (x.Narocnik.Ime + " " + x.Narocnik.Priimek).Trim(),
                VrstaStoritveId = x.VrstaStoritveId,
                VrstaStoritve = x.VrstaStoritve.Naziv,
                OpisDela = x.OpisDela,
                Lokacija = x.Lokacija,
                ZeleniTermin = x.ZeleniTermin,
                DatumOddaje = x.DatumOddaje,
                Status = x.Status,
                RazlogZavrnitve = x.RazlogZavrnitve,
                DelovniNalogId = x.DelovniNalog == null ? null : (int?)x.DelovniNalog.Id,
            })
            .SingleOrDefaultAsync(cancellationToken);
    }

    private IQueryable<Narocilo> DostopnaNarocila(int uporabnikId, bool jeOrganizator)
    {
        return context.Narocila
            .AsNoTracking()
            .Where(x => jeOrganizator || x.NarocnikId == uporabnikId);
    }

    public Task<ObravnavaNarocilaRezultat> PotrdiAsync(int narociloId,CancellationToken cancellationToken = default)
    {
        return ObravnavaAsync(
            narociloId, StatusNarocila.Potrjeno, null, cancellationToken);
    }

    public Task<ObravnavaNarocilaRezultat> ZavrniAsync(int narociloId,ZavrniNarociloDto dto,CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(dto.Razlog))
            return Task.FromResult(ObravnavaNarocilaRezultat.NeveljavenRazlog);

        return ObravnavaAsync(
            narociloId, StatusNarocila.Zavrnjeno, dto.Razlog.Trim(), cancellationToken);
    }

    private async Task<ObravnavaNarocilaRezultat> ObravnavaAsync(int narociloId,StatusNarocila noviStatus,string? razlog, CancellationToken cancellationToken)
    {
        var spremenjeno = await context.Narocila
            .Where(x => x.Id == narociloId && x.Status == StatusNarocila.Oddano)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(x => x.Status, noviStatus)
                .SetProperty(x => x.RazlogZavrnitve, razlog),
                cancellationToken);

        if (spremenjeno == 1)
            return ObravnavaNarocilaRezultat.Uspeh;

        var obstaja = await context.Narocila
            .AnyAsync(x => x.Id == narociloId, cancellationToken);

        return obstaja ? ObravnavaNarocilaRezultat.NapacnoStanje : ObravnavaNarocilaRezultat.NeObstaja;
    }
}