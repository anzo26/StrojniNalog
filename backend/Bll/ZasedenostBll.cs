using Microsoft.EntityFrameworkCore;
using StrojniNalog.Api.Bll.Results;
using StrojniNalog.Api.Data;

namespace StrojniNalog.Api.Bll;

public class ZasedenostBll(AppDbContext context)
{
    public const string StrojConstraint = "EX_DelovniNalogi_StrojTermin";
    public const string IzvajalecConstraint = "EX_DelovniNalogi_IzvajalecTermin";

    public async Task<ZasedenostTermina> PreveriAsync(
        int strojId,
        int izvajalecId,
        DateTime zacetek,
        DateTime konec,
        CancellationToken cancellationToken = default)
    {
        var prekrivajoci = context.DelovniNalogi.Where(x =>
            x.PredvideniZacetek < konec &&
            zacetek < x.PredvideniKonec);

        var strojZaseden = await prekrivajoci
            .AnyAsync(x => x.StrojId == strojId, cancellationToken);

        var izvajalecZaseden = await prekrivajoci
            .AnyAsync(x => x.IzvajalecId == izvajalecId, cancellationToken);

        return new(strojZaseden, izvajalecZaseden);
    }
}