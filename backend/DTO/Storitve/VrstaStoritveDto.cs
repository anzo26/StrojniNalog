namespace StrojniNalog.Api.DTOs.Storitve;

public class VrstaStoritveDto
{
    public int Id { get; init; }
    public string Naziv { get; init; } = string.Empty;
    public string? Opis { get; init; }
}