using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.DTO.Narocila;

public class NarociloSeznamDto
{
    public int Id { get; init; }
    public string Narocnik { get; init; } = string.Empty;
    public string VrstaStoritve { get; init; } = string.Empty;
    public DateTime ZeleniTermin { get; init; }
    public DateTime DatumOddaje { get; init; }
    public StatusNarocila Status { get; init; }
}