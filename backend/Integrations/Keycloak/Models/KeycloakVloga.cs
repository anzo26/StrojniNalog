using System.Text.Json.Serialization;

namespace StrojniNalog.Api.Integrations.Keycloak.Models;

public class KeycloakVloga
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;
}