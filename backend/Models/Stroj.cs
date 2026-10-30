
namespace StrojniNalog.Api.Models;

public class Stroj
{
    public int Id { get; set; }
    public string Oznaka { get; set; } = string.Empty;
    public string Naziv { get; set; } = string.Empty;
    public string? Opis { get; set; }
    public bool Razpolozljiv { get; set; } = true;
}
