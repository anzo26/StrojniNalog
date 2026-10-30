using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Data.Configurations;

public class UporabnikConfiguration: IEntityTypeConfiguration<Uporabnik>
{
 public void Configure(EntityTypeBuilder<Uporabnik> builder)
    {
        builder.ToTable("Uporabniki");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.AuthId).IsRequired();
        builder.HasIndex(x => x.AuthId).IsUnique();
        builder.Property(x => x.Ime).IsRequired();
        builder.Property(x => x.Priimek).IsRequired();
        builder.Property(x => x.Email).IsRequired();
    }
}
