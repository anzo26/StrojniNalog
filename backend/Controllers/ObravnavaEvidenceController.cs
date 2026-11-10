using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.DTO.DelovniNalogi;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/delovni-nalogi/{id:int}/evidenca")]
[Authorize(Roles = AppRoles.Organizator)]
public class ObravnavaEvidenceController(ObravnavaEvidenceBll obravnavaEvidenceBll)
    : ControllerBase
{
    [HttpPost("potrditev")]
    public async Task<IActionResult> Potrdi(
        int id,
        CancellationToken cancellationToken)
    {
        var rezultat = await obravnavaEvidenceBll.PotrdiAsync(id, cancellationToken);
        return OdgovorObravnave(rezultat);
    }

    [HttpPost("vrnitev")]
    public async Task<IActionResult> Vrni(
        int id,
        [FromBody] VrniEvidencoDto dto,
        CancellationToken cancellationToken)
    {
        var rezultat = await obravnavaEvidenceBll.VrniAsync(
            id, dto.Razlog, cancellationToken);

        return OdgovorObravnave(rezultat);
    }

    private IActionResult OdgovorObravnave(ObravnavaEvidenceRezultat rezultat)
    {
        return rezultat switch
        {
            ObravnavaEvidenceRezultat.Uspeh => NoContent(),

            ObravnavaEvidenceRezultat.NalogNeObstaja =>
                Problem(
                    detail: "Delovni nalog ne obstaja.",
                    statusCode: StatusCodes.Status404NotFound),

            ObravnavaEvidenceRezultat.NeveljavnoStanje =>
                Problem(
                    detail: "Obravnavati je mogoče samo evidenco, ki čaka na pregled.",
                    statusCode: StatusCodes.Status409Conflict),

            ObravnavaEvidenceRezultat.ManjkajocRazlog =>
                NapakaRazloga(),

            _ => throw new InvalidOperationException(
                "Neveljaven rezultat obravnave evidence.")
        };
    }

    private ActionResult NapakaRazloga()
    {
        ModelState.AddModelError(
            nameof(VrniEvidencoDto.Razlog),
            "Vnesite razlog dopolnitve.");

        return ValidationProblem(ModelState);
    }
}