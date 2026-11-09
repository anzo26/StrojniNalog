using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.DTO.DelovniNalogi;
using StrojniNalog.Api.Extensions;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/delovni-nalogi/{id:int}/evidenca")]
[Authorize]
public class EvidencaDelaController(EvidencaDelaBll evidencaBll) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = AppRoles.Organizator + "," + AppRoles.Izvajalec)]
    public async Task<ActionResult<EvidencaDelaDto>> Podrobnosti( int id, CancellationToken cancellationToken)
    {
        var evidenca = await evidencaBll.PridobiAsync(
            id, HttpContext.PridobiDostopDoNalogov(), cancellationToken);

        if (evidenca is null)
            return NotFound();

        return Ok(evidenca);
    }

    [HttpPut]
    [Authorize(Roles = AppRoles.Izvajalec)]
    public async Task<IActionResult> Shrani(int id,[FromBody] ShraniEvidencoDto dto,CancellationToken cancellationToken)
    {
        var uporabnik = HttpContext.PridobiUporabnika();
        var rezultat = await evidencaBll.ShraniAsync(
            id, uporabnik.Id, dto, cancellationToken);

        return OdgovorSpremembe(rezultat);
    }

    [HttpPost("oddaja")]
    [Authorize(Roles = AppRoles.Izvajalec)]
    public async Task<IActionResult> Oddaj(int id,[FromBody] OddajEvidencoDto dto,CancellationToken cancellationToken)
    {
        var uporabnik = HttpContext.PridobiUporabnika();
        var rezultat = await evidencaBll.OddajAsync(
            id, uporabnik.Id, dto, cancellationToken);

        return OdgovorSpremembe(rezultat);
    }

    private ActionResult OdgovorSpremembe(EvidencaDelaRezultat rezultat)
    {
        return rezultat switch
        {
            EvidencaDelaRezultat.Uspeh => NoContent(),

            EvidencaDelaRezultat.NalogNeObstaja => Problem(
                detail: "Delovni nalog ne obstaja.",
                statusCode: StatusCodes.Status404NotFound),

            EvidencaDelaRezultat.NeveljavnoStanje => Problem(
                detail: "Evidenco je mogoče spreminjati samo pri nalogu v stanju V_IZVAJANJU ali V_DOPOLNITVI.",
                statusCode: StatusCodes.Status409Conflict),

            EvidencaDelaRezultat.NeveljavneUre => NapakaPolja(
                nameof(ShraniEvidencoDto.OpravljeneUre),
                "Opravljene ure morajo biti večje od 0 in največ 1000."),

            EvidencaDelaRezultat.ManjkajocOpis => NapakaPolja(
                nameof(OddajEvidencoDto.OpisIzvedbe),
                "Vnesite opis izvedbe."),

            EvidencaDelaRezultat.NeveljavenPotek => Problem(
                detail: "Pred oddajo evidence morata biti zabeležena dejanski začetek in konec dela. Konec ne sme biti pred začetkom.",
                statusCode: StatusCodes.Status409Conflict),

            _ => throw new InvalidOperationException("Neveljaven rezultat spremembe evidence.")
        };
    }

    private ActionResult NapakaPolja(string polje, string sporocilo)
    {
        ModelState.AddModelError(polje, sporocilo);
        return ValidationProblem(ModelState);
    }
}