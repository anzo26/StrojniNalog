using System.ComponentModel.DataAnnotations;

namespace StrojniNalog.Api.Integrations.Keycloak;

public class KeycloakAdminOptions
{
    public const string SectionName = "KeycloakAdmin";

    [Required]
    public string BaseUrl { get; set; } = string.Empty;

    [Required]
    public string Realm { get; set; } = string.Empty;

    [Required]
    public string ClientId { get; set; } = string.Empty;

    [Required]
    public string ClientSecret { get; set; } = string.Empty;
}