using System.ComponentModel.DataAnnotations;

namespace StrojniNalog.Api.DTOs.DelovniNalogi;

public class PripraviDelovniNalogDto
{
    [Range(1, int.MaxValue, ErrorMessage = "Izberite naročilo.")]
    public int NarociloId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Izberite stroj.")]
    public int StrojId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Izberite izvajalca.")]
    public int IzvajalecId { get; set; }

    [Required(ErrorMessage = "Vnesite predvideni začetek.")]
    public DateTimeOffset? PredvideniZacetek { get; set; }

    [Required(ErrorMessage = "Vnesite predvideni konec.")]
    public DateTimeOffset? PredvideniKonec { get; set; }
}