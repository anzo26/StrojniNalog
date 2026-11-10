using System.ComponentModel.DataAnnotations;

namespace StrojniNalog.Api.DTO.DelovniNalogi;

public class VrniEvidencoDto
{
    [Required(ErrorMessage = "Vnesite razlog dopolnitve.")]
    public string Razlog { get; set; } = string.Empty;
}