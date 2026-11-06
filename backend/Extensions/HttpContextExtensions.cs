using StrojniNalog.Api.Models;

namespace StrojniNalog.Api.Extensions;

public static class HttpContextExtensions
{
    public static Uporabnik PridobiUporabnika(this HttpContext context)
    {
        return context.Items[typeof(Uporabnik)] as Uporabnik
            ?? throw new InvalidOperationException("Profil overjenega uporabnika ni bil pripravljen.");
    }
}