using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;

namespace StrojniNalog.Api.Security;

public class KeycloakRolesTransformation : IClaimsTransformation
{
    public Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity is not ClaimsIdentity identity || !identity.IsAuthenticated)
            return Task.FromResult(principal);

        var realmAccess = identity.FindFirst("realm_access")?.Value;
        if (string.IsNullOrWhiteSpace(realmAccess))
            return Task.FromResult(principal);

        try
        {
            using var document = JsonDocument.Parse(realmAccess);
            var root = document.RootElement;

            if (root.ValueKind != JsonValueKind.Object ||
                !root.TryGetProperty("roles", out var roles) ||
                roles.ValueKind != JsonValueKind.Array)
                return Task.FromResult(principal);

            foreach (var element in roles.EnumerateArray())
            {
                if (element.ValueKind != JsonValueKind.String)
                    continue;

                var role = element.GetString();
                if (role is not (AppRoles.Narocnik or AppRoles.Organizator or AppRoles.Izvajalec))
                    continue;

                if (!identity.HasClaim(ClaimTypes.Role, role))
                    identity.AddClaim(new Claim(ClaimTypes.Role, role));
            }
        }
        catch (JsonException)
        {
            return Task.FromResult(principal);
        }

        return Task.FromResult(principal);
    }
}