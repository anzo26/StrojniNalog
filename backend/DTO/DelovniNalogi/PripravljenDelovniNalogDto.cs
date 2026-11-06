using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.DTOs.DelovniNalogi;

public class PripravljenDelovniNalogDto
{
    public int Id { get; init; }
    public StatusDelovnegaNaloga Status { get; init; }
}