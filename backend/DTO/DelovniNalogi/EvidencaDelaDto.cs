using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.DTO.DelovniNalogi;

public class EvidencaDelaDto
{
    public int DelovniNalogId { get; init; }
    public decimal? OpravljeneUre { get; init; }
    public string? OpisIzvedbe { get; init; }
    public string? RazlogDopolnitve { get; init; }
    public StatusDelovnegaNaloga Status { get; init; }
    public DateTime? DejanskiZacetek { get; set; }
    public DateTime? DejanskiKonec { get; set; }
}