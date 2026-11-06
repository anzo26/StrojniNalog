using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.DTOs.Narocila;

public class OddanoNarociloDto
{
    public int Id { get; init; }
    public StatusNarocila Status { get; init; }
    public DateTime DatumOddaje { get; init; }
}