using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.DTOs.DelovniNalogi;

public class DelovniNalogPodrobnostiDto
{
    public int Id { get; init; }
    public int NarociloId { get; init; }
    public int StrojId { get; init; }
    public string Stroj { get; init; } = string.Empty;
    public int IzvajalecId { get; init; }
    public string Izvajalec { get; init; } = string.Empty;
    public DateTime PredvideniZacetek { get; init; }
    public DateTime PredvideniKonec { get; init; }
    public StatusDelovnegaNaloga Status { get; init; }
}