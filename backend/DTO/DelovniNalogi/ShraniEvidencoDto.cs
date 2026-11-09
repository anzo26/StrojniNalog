using System.ComponentModel.DataAnnotations;

namespace StrojniNalog.Api.DTO.DelovniNalogi;

public class ShraniEvidencoDto
{
    [Range(typeof(decimal), "0", "1000",MinimumIsExclusive = true,ErrorMessage = "Opravljene ure morajo biti večje od 0 in največ 1000.")]
    public decimal? OpravljeneUre { get; set; }

    public string? OpisIzvedbe { get; set; }
}