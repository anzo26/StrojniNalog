namespace StrojniNalog.Api.DTOs.Narocila;

public class OddanoNarociloDto
{
    public int Id { get; init; }
    public string Status { get; init; } = string.Empty;
    public DateTime DatumOddaje { get; init; }
}