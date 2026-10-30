using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Data.Configurations;

public class StrojConfiguration: IEntityTypeConfiguration<Stroj>
{
    public void Configure(EntityTypeBuilder<Stroj> builder)
    {
        builder.ToTable("Stroji");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Oznaka).IsRequired();
        builder.HasIndex(x => x.Oznaka).IsUnique();
        builder.Property(x => x.Naziv).IsRequired();
        builder.Property(x => x.Opis).IsRequired(false);
        builder.Property(x => x.Razpolozljiv).IsRequired();
    }
}
