using System.ComponentModel.DataAnnotations;

namespace StrojniNalog.Api.DTOs.Narocila;

public class ZavrniNarociloDto
{
    [Required(ErrorMessage = "Vnesite razlog zavrnitve.")]
    public string Razlog { get; set; } = string.Empty;
}