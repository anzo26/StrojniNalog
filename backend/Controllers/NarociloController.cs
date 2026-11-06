using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.DTO.Narocila;
using StrojniNalog.Api.DTOs.Narocila;
using StrojniNalog.Api.Extensions;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Models.Enums;
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
        var narocnik = HttpContext.PridobiUporabnika();
        var narocilo = await narociloBll.OddajAsync(dto, narocnik.Id, cancellationToken);

        if (narocilo is null)
        {
            ModelState.AddModelError(nameof(dto.VrstaStoritveId), "Izbrana storitev ne obstaja ali ni aktivna.");
            return ValidationProblem(ModelState);
        }

        return StatusCode(StatusCodes.Status201Created, narocilo);
    }

    [HttpGet]
    [Authorize(Roles = AppRoles.Narocnik + "," + AppRoles.Organizator)]
    public async Task<ActionResult<List<NarociloSeznamDto>>> Seznam(CancellationToken cancellationToken)
    {
        var uporabnik = HttpContext.PridobiUporabnika();
        var narocila = await narociloBll.PridobiSeznamAsync(
            uporabnik.Id,
            User.IsInRole(AppRoles.Organizator),
            cancellationToken);

        return Ok(narocila);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = AppRoles.Narocnik + "," + AppRoles.Organizator)]
    public async Task<ActionResult<NarociloPodrobnostiDto>> Podrobnosti(int id,CancellationToken cancellationToken)
    {
        var uporabnik = HttpContext.PridobiUporabnika();
        var narocilo = await narociloBll.PridobiPodrobnostiAsync(
            id,
            uporabnik.Id,
            User.IsInRole(AppRoles.Organizator),
            cancellationToken);

        if (narocilo is null)
            return NotFound();

        return Ok(narocilo);
    }

    [HttpPost("{id:int}/potrditev")]
    [Authorize(Roles = AppRoles.Organizator)]
    public async Task<IActionResult> Potrdi(int id, CancellationToken cancellationToken)
    {
        var rezultat = await narociloBll.PotrdiAsync(id, cancellationToken);
        return OdgovorObravnave(rezultat);
    }

    [HttpPost("{id:int}/zavrnitev")]
    [Authorize(Roles = AppRoles.Organizator)]
    public async Task<IActionResult> Zavrni(int id, [FromBody] ZavrniNarociloDto dto, CancellationToken cancellationToken)
    {
        var rezultat = await narociloBll.ZavrniAsync(id, dto, cancellationToken);
        return OdgovorObravnave(rezultat);
    }

    private ActionResult OdgovorObravnave(ObravnavaNarocilaRezultat rezultat)
    {
        return rezultat switch
        {
            ObravnavaNarocilaRezultat.Uspeh => NoContent(),
            ObravnavaNarocilaRezultat.NeObstaja => Problem(
                detail: "Naročilo ne obstaja.",
                statusCode: StatusCodes.Status404NotFound),
            ObravnavaNarocilaRezultat.NapacnoStanje => Problem(
                detail: "Obravnavati je mogoče samo naročilo v stanju ODDANO. Osvežite podatke.",
                statusCode: StatusCodes.Status409Conflict),
            ObravnavaNarocilaRezultat.NeveljavenRazlog => NapakaRazloga(),
            _ => throw new InvalidOperationException("Neznan rezultat obravnave naročila.")
        };
    }
    private ActionResult NapakaRazloga()
    {
        ModelState.AddModelError(
            nameof(ZavrniNarociloDto.Razlog),
            "Vnesite razlog zavrnitve.");

        return ValidationProblem(ModelState);
    }
}