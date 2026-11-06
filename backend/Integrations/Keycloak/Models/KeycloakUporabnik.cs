using System.Text.Json.Serialization;

namespace StrojniNalog.Api.Integrations.Keycloak.Models;

public class KeycloakUporabnik
{
    [JsonPropertyName("id")]
    public string Id { get; init; } = string.Empty;

    [JsonPropertyName("username")]
    public string? Username { get; init; }

    [JsonPropertyName("firstName")]
    public string? FirstName { get; init; }

    [JsonPropertyName("lastName")]
    public string? LastName { get; init; }

    [JsonPropertyName("email")]
    public string? Email { get; init; }

    [JsonPropertyName("enabled")]
    public bool Enabled { get; init; }

    [JsonPropertyName("serviceAccountClientId")]
    public string? ServiceAccountClientId { get; init; }
}