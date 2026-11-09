using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Data;
using StrojniNalog.Api.DTO.Stroji;

namespace StrojniNalog.Api.Bll;

public class StrojBll(AppDbContext context)
{
    public async Task<List<StrojDto>> PridobiRazpolozljiveAsync(CancellationToken cancellationToken = default)
    {
        return await context.Stroji
            .AsNoTracking()
            .Where(x => x.Razpolozljiv)
            .OrderBy(x => x.Oznaka)
            .Select(x => new StrojDto
            {
                Id = x.Id,
                Oznaka = x.Oznaka,
                Naziv = x.Naziv
            })
            .ToListAsync(cancellationToken);
    }
}