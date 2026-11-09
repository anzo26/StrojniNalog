using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.DTO.DelovniNalogi;

public class DelovniNalogSeznamDto
{
    public int Id { get; init; }
    public int NarociloId { get; init; }
    public string Stroj { get; init; } = string.Empty;
    public string Izvajalec { get; init; } = string.Empty;
    public DateTime PredvideniZacetek { get; init; }
    public DateTime PredvideniKonec { get; init; }
    public DateTime? DejanskiZacetek { get; init; }
    public DateTime? DejanskiKonec { get; init; }
    public StatusDelovnegaNaloga Status { get; init; }
}