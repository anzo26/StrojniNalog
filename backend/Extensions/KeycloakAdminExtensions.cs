using Microsoft.Extensions.Options;
using StrojniNalog.Api.Integrations.Keycloak;

namespace StrojniNalog.Api.Extensions;

public static class KeycloakAdminExtensions
{
    public static IServiceCollection AddKeycloakAdmin(this IServiceCollection services,IConfiguration configuration)
    {
        services.AddOptions<KeycloakAdminOptions>()
            .Bind(configuration.GetSection(KeycloakAdminOptions.SectionName))
            .ValidateDataAnnotations()
            .Validate(options =>
                Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out var uri) &&
                (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps) &&
                string.IsNullOrEmpty(uri.UserInfo) &&
                string.IsNullOrEmpty(uri.Query) &&
                string.IsNullOrEmpty(uri.Fragment),
                "KeycloakAdmin:BaseUrl mora biti veljaven osnovni HTTP ali HTTPS naslov.")
            .ValidateOnStart();

        services.AddHttpClient(KeycloakAdminOptions.SectionName, (provider, client) =>
        {
            var options = provider.GetRequiredService<IOptions<KeycloakAdminOptions>>().Value;
            client.BaseAddress = new Uri(options.BaseUrl.TrimEnd('/') + "/");
            client.Timeout = TimeSpan.FromSeconds(15);
        });

        services.AddSingleton<KeycloakTokenProvider>();
        services.AddScoped<KeycloakAdminClient>();

        return services;
    }
}