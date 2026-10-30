using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Models;

public class Narocilo
{
    public int Id { get; set; }
    public int NarocnikId { get; set; }
    public int VrstaStoritveId { get; set; }
    public string OpisDela { get; set; } = string.Empty;
    public string Lokacija { get; set; } = string.Empty;
    public DateTime ZeleniTermin { get; set; }
    public DateTime DatumOddaje { get; set; }
    public StatusNarocila Status { get; set; } = StatusNarocila.Oddano;
    public string? RazlogZavrnitve { get; set; }
    public Uporabnik Narocnik { get; set; } = null!;
    public VrstaStoritve VrstaStoritve { get; set; } = null!;
    public DelovniNalog? DelovniNalog { get; set; }
}
