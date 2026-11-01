using StrojniNalog.Api.Bll;
using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Middleware;

public class UporabnikMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, UporabnikBll uporabnikBll)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var authId = context.User.FindFirst("sub")?.Value;
            if (string.IsNullOrWhiteSpace(authId))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.Headers.WWWAuthenticate = "Bearer";
                return;
            }

            var uporabnik = await uporabnikBll.PridobiAliUstvariAsync(
                context.User, context.RequestAborted);

            context.Items[typeof(Uporabnik)] = uporabnik;
        }

        await next(context);
    }
}