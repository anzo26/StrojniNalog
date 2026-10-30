using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<Uporabnik> Uporabniki => Set<Uporabnik>();
    public DbSet<VrstaStoritve> VrsteStoritev => Set<VrstaStoritve>();
    public DbSet<Stroj> Stroji => Set<Stroj>();
    public DbSet<Narocilo> Narocila => Set<Narocilo>();
    public DbSet<DelovniNalog> DelovniNalogi => Set<DelovniNalog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}