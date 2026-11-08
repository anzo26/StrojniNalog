using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.DTOs.DelovniNalogi;

namespace StrojniNalog.Api.Bll.Results;

public record PripravaNalogaOdgovor(
    PripravaNalogaRezultat Rezultat,
    PripravljenDelovniNalogDto? Nalog = null,
    ZasedenostTermina? Zasedenost = null);