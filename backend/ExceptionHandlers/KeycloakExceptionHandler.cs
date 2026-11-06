using Microsoft.AspNetCore.Diagnostics;
using StrojniNalog.Api.Integrations.Keycloak;

namespace StrojniNalog.Api.ExceptionHandlers;

public sealed class KeycloakExceptionHandler(ILogger<KeycloakExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext,Exception exception,CancellationToken cancellationToken)
    {
        if (exception is not KeycloakException)
            return false;

        logger.LogError(exception, "Dostop do Keycloak Admin API-ja ni uspel.");

        await Results.Problem(
            statusCode: StatusCodes.Status503ServiceUnavailable,
            title: "Preverjanje uporabnikov trenutno ni na voljo.",
            detail: "Podatkov iz sistema za prijavo ni bilo mogoče pridobiti. Poskusite pozneje."
        ).ExecuteAsync(httpContext);

        return true;
    }
}