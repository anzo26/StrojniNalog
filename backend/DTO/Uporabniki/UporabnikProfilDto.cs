namespace StrojniNalog.Api.DTO.Uporabniki;

public class UporabnikProfilDto
{
    public int Id { get; init; }
    public string Ime { get; init; } = string.Empty;
    public string Priimek { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string[] Vloge { get; init; } = [];
}