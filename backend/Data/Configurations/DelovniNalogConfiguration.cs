using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Data.Configurations;

public class DelovniNalogConfiguration: IEntityTypeConfiguration<DelovniNalog>
{
    public void Configure(EntityTypeBuilder<DelovniNalog> builder)
    {
        builder.ToTable("DelovniNalogi", table =>
        {
            table.HasCheckConstraint("CK_DelovniNalogi_PredvideniTermin", "\"PredvideniKonec\" > \"PredvideniZacetek\"");
            table.HasCheckConstraint("CK_DelovniNalogi_DejanskiTermin", "\"DejanskiKonec\" IS NULL OR (\"DejanskiZacetek\" IS NOT NULL AND \"DejanskiKonec\" >= \"DejanskiZacetek\")");
            table.HasCheckConstraint("CK_DelovniNalogi_OpravljeneUre", "\"OpravljeneUre\" IS NULL OR \"OpravljeneUre\" > 0");
            table.HasCheckConstraint("CK_DelovniNalogi_Status", "\"Status\" IN ('NACRTOVAN', 'V_IZVAJANJU', 'CAKA_NA_PREGLED', 'ZAKLJUCEN', 'V_DOPOLNITVI')");
        });
        builder.HasKey(x => x.Id);
        builder.Property(x => x.PredvideniZacetek).IsRequired();
        builder.Property(x => x.PredvideniKonec).IsRequired();
        builder.Property(x => x.DejanskiZacetek).IsRequired(false);
        builder.Property(x => x.DejanskiKonec).IsRequired(false);
        builder.Property(x => x.OpravljeneUre).IsRequired(false);
        builder.Property(x => x.OpisIzvedbe).IsRequired(false);
        builder.Property(x => x.RazlogDopolnitve).IsRequired(false);
        builder.Property(x => x.Status)
            .HasConversion(x => StatusVBesedilo(x), x => BesediloVStatus(x))
            .IsRequired();
        builder.HasOne(x => x.Narocilo)
            .WithOne(x => x.DelovniNalog)
            .HasForeignKey<DelovniNalog>(x => x.NarociloId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.Stroj)
            .WithMany()
            .HasForeignKey(x => x.StrojId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.Izvajalec)
            .WithMany()
            .HasForeignKey(x => x.IzvajalecId)
            .OnDelete(DeleteBehavior.Restrict);
    }

    private static string StatusVBesedilo(StatusDelovnegaNaloga status) => status switch
    {
        StatusDelovnegaNaloga.Nacrtovan => "NACRTOVAN",
        StatusDelovnegaNaloga.VIzvajanju => "V_IZVAJANJU",
        StatusDelovnegaNaloga.CakaNaPregled => "CAKA_NA_PREGLED",
        StatusDelovnegaNaloga.Zakljucen => "ZAKLJUCEN",
        StatusDelovnegaNaloga.VDopolnitvi => "V_DOPOLNITVI",
        _ => throw new ArgumentOutOfRangeException(nameof(status), status, "Neveljaven status.")
    };

    private static StatusDelovnegaNaloga BesediloVStatus(string status) => status switch
    {
        "NACRTOVAN" => StatusDelovnegaNaloga.Nacrtovan,
        "V_IZVAJANJU" => StatusDelovnegaNaloga.VIzvajanju,
        "CAKA_NA_PREGLED" => StatusDelovnegaNaloga.CakaNaPregled,
        "ZAKLJUCEN" => StatusDelovnegaNaloga.Zakljucen,
        "V_DOPOLNITVI" => StatusDelovnegaNaloga.VDopolnitvi,
        _ => throw new InvalidOperationException($"Neveljaven status v bazi: {status}.")
    };
}
