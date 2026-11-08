namespace StrojniNalog.Api.Bll.Results;

public record ZasedenostTermina(bool StrojZaseden, bool IzvajalecZaseden)
{
    public bool JeZaseden => StrojZaseden || IzvajalecZaseden;
}