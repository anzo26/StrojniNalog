using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.DTO.DelovniNalogi;

namespace StrojniNalog.Api.Bll.Results;

public record PripravaNalogaOdgovor(
    PripravaNalogaRezultat Rezultat,
    PripravljenDelovniNalogDto? Nalog = null,
    ZasedenostTermina? Zasedenost = null);