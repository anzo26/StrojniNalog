using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Data.Configurations;

public class NarociloConfiguraton: IEntityTypeConfiguration<Narocilo>
{
    public void Configure(EntityTypeBuilder<Narocilo> builder)
    {
        builder.ToTable("Narocila", table =>
        {
            table.HasCheckConstraint("CK_Narocila_Status", "\"Status\" IN ('ODDANO', 'POTRJENO', 'ZAVRNJENO')");
            table.HasCheckConstraint("CK_Narocila_RazlogZavrnitve", "\"Status\" <> 'ZAVRNJENO' OR (\"RazlogZavrnitve\" IS NOT NULL AND length(trim(\"RazlogZavrnitve\")) > 0)");
        });
        builder.HasKey(x => x.Id);
        builder.Property(x => x.OpisDela).IsRequired();
        builder.Property(x => x.Lokacija).IsRequired();
        builder.Property(x => x.ZeleniTermin).IsRequired();
        builder.Property(x => x.DatumOddaje).IsRequired();
        builder.Property(x => x.RazlogZavrnitve).IsRequired(false);
        builder.Property(x => x.Status)
            .HasConversion(x => x.ToString().ToUpperInvariant(), x => Enum.Parse<StatusNarocila>(x, true))
            .IsRequired();
        builder.HasOne(x => x.Narocnik)
            .WithMany()
            .HasForeignKey(x => x.NarocnikId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.VrstaStoritve)
            .WithMany()
            .HasForeignKey(x => x.VrstaStoritveId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
