
namespace StrojniNalog.Api.Models;

public class VrstaStoritve
{
    public int Id { get; set; }
    public string Naziv { get; set; } = string.Empty;
    public string? Opis { get; set; }
    public bool Aktivna { get; set; } = true;
}
