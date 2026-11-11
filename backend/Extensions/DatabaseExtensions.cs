using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Data;

namespace StrojniNalog.Api.Extensions;

public static class DatabaseExtensions
{
    public static void ApplyDatabaseMigrations(this WebApplication app)
    {
        if (!app.Configuration.GetValue<bool>("Database:ApplyMigrations"))
            return;

        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        app.Logger.LogInformation("Priprava podatkovne baze ...");
        context.Database.Migrate();
        app.Logger.LogInformation("Podatkovna baza je pripravljena.");
    }
}