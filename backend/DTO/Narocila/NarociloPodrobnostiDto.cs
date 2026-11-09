using StrojniNalog.Api.DTO.Narocila;

namespace StrojniNalog.Api.DTO.Narocila;

public class NarociloPodrobnostiDto : NarociloSeznamDto
{
    public int NarocnikId { get; init; }
    public int VrstaStoritveId { get; init; }
    public string OpisDela { get; init; } = string.Empty;
    public string Lokacija { get; init; } = string.Empty;
    public string? RazlogZavrnitve { get; init; }
    public int? DelovniNalogId { get; init; }
}