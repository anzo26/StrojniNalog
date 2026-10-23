# Avtentikacija: Keycloak

## Kontekst in opis problema

Naročnik se mora registrirati sam, račune organizatorjev in izvajalcev pa pripravi tehnični skrbnik. Potrebujemo prijavo za React in ASP.NET Core API ter upravljanje treh aplikacijskih vlog.

## Obravnavane možnosti

* **Keycloak** – samostojno gostovan odprtokoden sistem s prijavo, registracijo in skrbniškim vmesnikom za račune ter vloge.
* **Firebase Authentication** – upravljana oblačna avtentikacija; aplikacijske vloge določimo z dodatnimi podatki v žetonih.

## Sprejeta odločitev

Izbral sem **Keycloak**, ker omogoča registracijo naročnikov in upravljanje računov ter vlog zaposlenih prek obstoječega skrbniškega vmesnika. Z ASP.NET Core Identity bi morali pripraviti še vmesnik za skrbniško upravljanje uporabnikov in dodeljevanje vlog. Firebase bi zmanjšal vzdrževanje strežnika, vendar bi produkcijsko prijavo vezal na oblačno storitev; Keycloak lahko vključimo v predvideni lokalni Docker zagon.

Samostojna registracija dodeli samo vlogo naročnika, vlogi organizatorja in izvajalca dodeli skrbnik. Prijavo povežemo prek OpenID Connect (Authorization Code + PKCE), backend pa preverja žeton, vlogo in dostop do posameznega zapisa.

### Posledice

* **Pozitivno:** Prijava, registracija, gesla in dodeljevanje vlog so zbrani v namenskem sistemu.
* **Pozitivno:** Račune zaposlenih upravljamo brez razvoja dodatnih skrbniških zaslonov v StrojniNalog.
* **Negativno:** Vzdrževati in posodabljati moramo dodatni strežnik ter njegove podatke.
* **Negativno:** Izpad Keycloaka prepreči nove prijave in osveževanje žetonov.
