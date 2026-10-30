using System;
using StrojniNalog.Api.Models.Enums;

namespace StrojniNalog.Api.Models;

public class DelovniNalog
{
    public int Id { get; set; }
    public int NarociloId { get; set; }
    public int StrojId { get; set; }
    public int IzvajalecId { get; set; }
    public DateTime PredvideniZacetek { get; set; }
    public DateTime PredvideniKonec { get; set; }
    public DateTime? DejanskiZacetek { get; set; }
    public DateTime? DejanskiKonec { get; set; }
    public decimal? OpravljeneUre { get; set; }
    public string? OpisIzvedbe { get; set; }
    public StatusDelovnegaNaloga Status { get; set; } = StatusDelovnegaNaloga.Nacrtovan;
    public string? RazlogDopolnitve { get; set; }
    public Narocilo Narocilo { get; set; } = null!;
    public Stroj Stroj { get; set; } = null!;
    public Uporabnik Izvajalec { get; set; } = null!;
}
