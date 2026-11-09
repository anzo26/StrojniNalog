using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.DTO.Storitve;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/vrste-storitev")]
[Authorize]
public class VrsteStoritevController(NarociloBll narociloBll) : ControllerBase
{
    [HttpGet("aktivne")]
    public async Task<ActionResult<List<VrstaStoritveDto>>> Aktivne(CancellationToken cancellationToken)
    {
        return Ok(await narociloBll.PridobiAktivneStoritveAsync(cancellationToken));
    }
}