using StrojniNalog.Api.Bll.Models;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Extensions;

public static class HttpContextExtensions
{
    public static Uporabnik PridobiUporabnika(this HttpContext context)
    {
        return context.Items[typeof(Uporabnik)] as Uporabnik
            ?? throw new InvalidOperationException("Profil overjenega uporabnika ni bil pripravljen.");
    }

    public static DostopDoNalogov PridobiDostopDoNalogov(this HttpContext context)
    {
        var uporabnik = context.PridobiUporabnika();

        return new(
            uporabnik.Id,
            context.User.IsInRole(AppRoles.Organizator),
            context.User.IsInRole(AppRoles.Izvajalec),
            context.User.IsInRole(AppRoles.Narocnik));
    }
}