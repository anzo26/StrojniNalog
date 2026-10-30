using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Data;

public static class DatabaseSeeder
{
 public static void Seed(AppDbContext context)
    {
        VrstaStoritve[] storitve =
        [
            new() { Naziv = "Izkop", Opis = "Izkopi z gradbeno mehanizacijo." },
            new() { Naziv = "Prevoz materiala", Opis = "Prevoz zemlje, peska in drugega materiala." },
            new() { Naziv = "Urejanje terena", Opis = "Izravnava in priprava terena." }
        ];
        foreach (var storitev in storitve)
        {
            if (!context.VrsteStoritev.Any(x => x.Naziv == storitev.Naziv))
                context.VrsteStoritev.Add(storitev);
        }

        Stroj[] stroji =
        [
            new() { Oznaka = "BAG-01", Naziv = "Bager" },
            new() { Oznaka = "KAM-01", Naziv = "Tovornjak" }
        ];
        foreach (var stroj in stroji)
        {
            if (!context.Stroji.Any(x => x.Oznaka == stroj.Oznaka))
                context.Stroji.Add(stroj);
        }

        context.SaveChanges();
    }
}
