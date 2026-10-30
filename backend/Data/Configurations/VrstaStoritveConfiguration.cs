using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Data.Configurations;

public class VrstaStoritveConfiguration: IEntityTypeConfiguration<VrstaStoritve>
{
    public void Configure(EntityTypeBuilder<VrstaStoritve> builder)
    {
        builder.ToTable("VrsteStoritev");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Naziv).IsRequired();
        builder.Property(x => x.Opis).IsRequired(false);
        builder.Property(x => x.Aktivna).IsRequired();
    }
}
