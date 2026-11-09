namespace StrojniNalog.Api.Bll.Models;

public record DostopDoNalogov(
    int UporabnikId,
    bool JeOrganizator,
    bool JeIzvajalec,
    bool JeNarocnik);