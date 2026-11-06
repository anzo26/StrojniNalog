using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StrojniNalog.Api.Bll;
using StrojniNalog.Api.DTOs.Stroji;
using StrojniNalog.Api.Security;

namespace StrojniNalog.Api.Controllers;

[ApiController]
[Route("api/stroji")]
[Authorize(Roles = AppRoles.Organizator)]
public class StrojiController(StrojBll strojBll) : ControllerBase
{
    [HttpGet("razpolozljivi")]
    public async Task<ActionResult<List<StrojDto>>> Razpolozljivi(
        CancellationToken cancellationToken)
    {
        var stroji = await strojBll.PridobiRazpolozljiveAsync(cancellationToken);
        return Ok(stroji);
    }
}