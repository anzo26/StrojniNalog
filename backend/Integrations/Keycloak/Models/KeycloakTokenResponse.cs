using System.Text.Json.Serialization;

namespace StrojniNalog.Api.Integrations.Keycloak.Models;

public class KeycloakTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; init; } = string.Empty;

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; init; }
}