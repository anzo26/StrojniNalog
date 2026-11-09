using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.DTO.DelovniNalogi;

public class PripravljenDelovniNalogDto
{
    public int Id { get; init; }
    public StatusDelovnegaNaloga Status { get; init; }
}