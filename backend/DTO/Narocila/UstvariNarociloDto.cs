using System.ComponentModel.DataAnnotations;

namespace StrojniNalog.Api.DTOs.Narocila;

public class UstvariNarociloDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Izberite vrsto storitve.")]
    public int VrstaStoritveId { get; set; }

    [Required(ErrorMessage = "Vnesite opis dela.")]
    public string OpisDela { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vnesite lokacijo.")]
    public string Lokacija { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vnesite želeni datum in čas.")]
    public DateTimeOffset? ZeleniTermin { get; set; }
}