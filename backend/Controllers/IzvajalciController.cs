using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.DTOs.Uporabniki;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/izvajalci")]
[Authorize(Roles = AppRoles.Organizator)]
public class IzvajalciController(IzvajalecBll izvajalecBll) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<IzvajalecDto>>> Seznam(
        CancellationToken cancellationToken)
    {
        var izvajalci = await izvajalecBll.PridobiAsync(cancellationToken);
        return Ok(izvajalci);
    }
}