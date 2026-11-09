using StrojniNalog.Api.DTO.DelovniNalogi;

namespace StrojniNalog.Api.DTO.DelovniNalogi;

public class DelovniNalogPodrobnostiDto : DelovniNalogSeznamDto
{
    public int StrojId { get; init; }
    public int IzvajalecId { get; init; }
}