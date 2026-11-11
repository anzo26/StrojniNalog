using Microsoft.Extensions.Diagnostics.HealthChecks;
using StrojniNalog.Api.Data;

namespace StrojniNalog.Api.HealthChecks;

public class DatabaseHealthCheck(AppDbContext context) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext healthContext,
        CancellationToken cancellationToken = default)
    {
        var povezavaDeluje = await context.Database
            .CanConnectAsync(cancellationToken);

        return povezavaDeluje
            ? HealthCheckResult.Healthy()
            : HealthCheckResult.Unhealthy("Povezava z bazo ni na voljo.");
    }
}