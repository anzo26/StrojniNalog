using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.DTOs.Narocila;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/narocila")]
[Authorize]
public class NarocilaController(NarociloBll narociloBll) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = AppRoles.Narocnik)]
    public async Task<ActionResult<OddanoNarociloDto>> Oddaj([FromBody] UstvariNarociloDto dto, CancellationToken cancellationToken)
    {
        if (HttpContext.Items[typeof(Uporabnik)] is not Uporabnik narocnik)
            return Problem(
                detail: "Profil overjenega uporabnika ni bil pripravljen.",
                statusCode: StatusCodes.Status500InternalServerError);

        var narocilo = await narociloBll.OddajAsync(dto, narocnik.Id, cancellationToken);

        if (narocilo is null)
        {
            ModelState.AddModelError(nameof(dto.VrstaStoritveId), "Izbrana storitev ne obstaja ali ni aktivna.");
            return ValidationProblem(ModelState);
        }

        return StatusCode(StatusCodes.Status201Created, narocilo);
    }
}