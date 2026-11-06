namespace StrojniNalog.Api.Integrations.Keycloak;

public class KeycloakException(string message, Exception? innerException = null): Exception(message, innerException)
{
}