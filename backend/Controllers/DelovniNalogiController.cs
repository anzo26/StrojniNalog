using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.Bll.Enums;
using StrojniNalog.Api.Bll.Models;
using StrojniNalog.Api.Bll.Results;
using StrojniNalog.Api.DTO.DelovniNalogi;
using StrojniNalog.Api.Extensions;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/delovni-nalogi")]
[Authorize]
public class DelovniNalogiController(DelovniNalogBll delovniNalogBll, DelovniNalogPregledBll pregledBll, PotekIzvedbeBll potekBll) : ControllerBase
{
    [HttpPost]
    [Authorize(Roles = AppRoles.Organizator)]
    public async Task<IActionResult> Pripravi([FromBody] PripraviDelovniNalogDto dto, CancellationToken cancellationToken)
    {
        var odgovor = await delovniNalogBll.PripraviAsync(dto, cancellationToken);
        return OdgovorPriprave(odgovor);
    }

    [HttpGet]
    [Authorize(Roles = AppRoles.Organizator + "," + AppRoles.Izvajalec + "," + AppRoles.Narocnik)]
    public async Task<ActionResult<List<DelovniNalogSeznamDto>>> Seznam(CancellationToken cancellationToken)
    {
        var nalogi = await pregledBll.PridobiSeznamAsync(
            PridobiDostop(), cancellationToken);

        return Ok(nalogi);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = AppRoles.Organizator + "," + AppRoles.Izvajalec + "," + AppRoles.Narocnik)]
    public async Task<ActionResult<DelovniNalogPodrobnostiDto>> Podrobnosti(
        int id,
        CancellationToken cancellationToken)
    {
        var nalog = await pregledBll.PridobiPodrobnostiAsync(
            id, PridobiDostop(), cancellationToken);

        if (nalog is null)
            return NotFound();

        return Ok(nalog);
    }

    [HttpPost("{id:int}/zacetek")]
    [Authorize(Roles = AppRoles.Izvajalec)]
    public async Task<IActionResult> ZabeleziZacetek(
    int id,
    CancellationToken cancellationToken)
    {
        var uporabnik = HttpContext.PridobiUporabnika();
        var rezultat = await potekBll.ZabeleziZacetekAsync(
            id, uporabnik.Id, cancellationToken);

        return OdgovorBelezenja(
            rezultat,
            "Začetek je mogoče zabeležiti samo enkrat pri nalogu v stanju NACRTOVAN.");
    }

    [HttpPost("{id:int}/konec")]
    [Authorize(Roles = AppRoles.Izvajalec)]
    public async Task<IActionResult> ZabeleziKonec(
        int id,
        CancellationToken cancellationToken)
    {
        var uporabnik = HttpContext.PridobiUporabnika();
        var rezultat = await potekBll.ZabeleziKonecAsync(
            id, uporabnik.Id, cancellationToken);

        return OdgovorBelezenja(
            rezultat,
            "Konec je mogoče zabeležiti samo enkrat po začetku dela pri nalogu v stanju V_IZVAJANJU. Čas konca ne sme biti pred začetkom.");
    }

    private ActionResult OdgovorBelezenja(
        BelezenjePotekaRezultat rezultat,
        string opisNapake)
    {
        return rezultat switch
        {
            BelezenjePotekaRezultat.Uspeh => NoContent(),

            BelezenjePotekaRezultat.NalogNeObstaja => Problem(
                detail: "Delovni nalog ne obstaja.",
                statusCode: StatusCodes.Status404NotFound),

            BelezenjePotekaRezultat.NeveljavnoStanje => Problem(
                detail: opisNapake,
                statusCode: StatusCodes.Status409Conflict),

            _ => throw new InvalidOperationException("Neveljaven rezultat beleženja poteka.")
        };
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

            PripravaNalogaRezultat.TerminZaseden when odgovor.Zasedenost is not null =>
                KonfliktTermina(odgovor.Zasedenost),

            _ => throw new InvalidOperationException("Neveljaven rezultat priprave naloga.")
        };
    }

    private ActionResult NapakaPolja(string polje, string sporocilo)
    {
        ModelState.AddModelError(polje, sporocilo);
        return ValidationProblem(ModelState);
    }

    private ActionResult KonfliktTermina(ZasedenostTermina zasedenost)
    {
        var opis = (zasedenost.StrojZaseden, zasedenost.IzvajalecZaseden) switch
        {
            (true, true) => "V izbranem terminu sta zasedena stroj in izvajalec.",
            (true, false) => "V izbranem terminu je stroj zaseden.",
            (false, true) => "V izbranem terminu je izvajalec zaseden.",
            _ => throw new InvalidOperationException("Manjka podatek o zasedenem viru.")
        };

        var problem = new ProblemDetails
        {
            Status = StatusCodes.Status409Conflict,
            Title = "Termin je zaseden.",
            Detail = opis
        };

        problem.Extensions["strojZaseden"] = zasedenost.StrojZaseden;
        problem.Extensions["izvajalecZaseden"] = zasedenost.IzvajalecZaseden;

        return Conflict(problem);
    }
    private DostopDoNalogov PridobiDostop()
    {
        var uporabnik = HttpContext.PridobiUporabnika();

        return new(
            uporabnik.Id,
            User.IsInRole(AppRoles.Organizator),
            User.IsInRole(AppRoles.Izvajalec),
            User.IsInRole(AppRoles.Narocnik));
    }
}