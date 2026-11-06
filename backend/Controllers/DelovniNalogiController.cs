using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.Bll.Results;
using StrojniNalog.Api.DTOs.DelovniNalogi;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/delovni-nalogi")]
[Authorize(Roles = AppRoles.Organizator)]
public class DelovniNalogiController(DelovniNalogBll delovniNalogBll) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Pripravi(
        [FromBody] PripraviDelovniNalogDto dto,
        CancellationToken cancellationToken)
    {
        var odgovor = await delovniNalogBll.PripraviAsync(dto, cancellationToken);
        return OdgovorPriprave(odgovor);
    }

    private ActionResult OdgovorPriprave(PripravaNalogaOdgovor odgovor)
    {
        return odgovor.Rezultat switch
        {
            PripravaNalogaRezultat.Uspeh when odgovor.Nalog is not null =>
                StatusCode(StatusCodes.Status201Created, odgovor.Nalog),

            PripravaNalogaRezultat.NarociloNeObstaja =>
                Problem(
                    detail: "Naročilo ne obstaja.",
                    statusCode: StatusCodes.Status404NotFound),

            PripravaNalogaRezultat.NarociloNiPotrjeno =>
                Problem(
                    detail: "Delovni nalog je mogoče pripraviti samo za potrjeno naročilo.",
                    statusCode: StatusCodes.Status409Conflict),

            PripravaNalogaRezultat.NalogZeObstaja =>
                Problem(
                    detail: "Za izbrano naročilo je delovni nalog že pripravljen.",
                    statusCode: StatusCodes.Status409Conflict),

            PripravaNalogaRezultat.NeveljavenStroj =>
                NapakaPolja(
                    nameof(PripraviDelovniNalogDto.StrojId),
                    "Izberite obstoječ in razpoložljiv stroj."),

            PripravaNalogaRezultat.NeveljavenIzvajalec =>
                NapakaPolja(
                    nameof(PripraviDelovniNalogDto.IzvajalecId),
                    "Izberite aktivnega uporabnika z vlogo izvajalca."),

            PripravaNalogaRezultat.NeveljavenTermin =>
                NapakaPolja(
                    nameof(PripraviDelovniNalogDto.PredvideniKonec),
                    "Predvideni konec mora biti po predvidenem začetku."),

            _ => throw new InvalidOperationException("Neveljaven rezultat priprave naloga.")
        };
    }

    private ActionResult NapakaPolja(string polje, string sporocilo)
    {
        ModelState.AddModelError(polje, sporocilo);
        return ValidationProblem(ModelState);
    }
}