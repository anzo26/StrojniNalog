namespace StrojniNalog.Api.DTOs.Stroji;

public class StrojDto
{
    public int Id { get; init; }
    public string Oznaka { get; init; } = string.Empty;
    public string Naziv { get; init; } = string.Empty;
}