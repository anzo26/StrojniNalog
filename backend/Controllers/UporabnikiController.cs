using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.DTO.Uporabniki;
using StrojniNalog.Api.Models;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/uporabniki")]
[Authorize]
public class UporabnikiController : ControllerBase
{
    [HttpGet("me")]
    public ActionResult<UporabnikProfilDto> MojProfil()
    {
        if (HttpContext.Items[typeof(Uporabnik)] is not Uporabnik uporabnik)
            return Problem(
                detail: "Profil overjenega uporabnika ni bil pripravljen.",
                statusCode: StatusCodes.Status500InternalServerError);

        return Ok(new UporabnikProfilDto
        {
            Id = uporabnik.Id,
            Ime = uporabnik.Ime,
            Priimek = uporabnik.Priimek,
            Email = uporabnik.Email,
            Vloge = User.FindAll(ClaimTypes.Role)
                .Select(x => x.Value)
                .Distinct()
                .ToArray()
        });
    }
}