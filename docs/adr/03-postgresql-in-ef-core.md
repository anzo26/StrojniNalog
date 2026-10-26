# Podatkovna baza: PostgreSQL in EF Core

## Kontekst in opis problema

Naročilo pripada naročniku in vrsti storitve, delovni nalog pa povezuje naročilo, stroj in izvajalca. Iste uporabnike in stroje uporablja več nalogov, potrebujemo pa tudi skupne preglede izvedb in opravljenih ur.

## Obravnavane možnosti

* **Relacijska baza PostgreSQL (SQL)** – povezane tabele, tuji ključi in omejitve podatkov.
* **Dokumentna baza MongoDB (NoSQL)** – dokumenti z vdelanimi podatki ali referencami na druge dokumente.

## Sprejeta odločitev

Izbral sem **relacijsko bazo PostgreSQL**, ker ima projekt vnaprej določene entitete in povezave. Tuji ključi preprečijo nalog z neobstoječim naročilom ali strojem, unikatna omejitev pa zagotovi največ en nalog na naročilo. Skupne preglede in seštevke ur pripravimo s povezovanjem tabel.

V MongoDB bi pri referencah skladnost povezav dodatno zagotavljali v aplikaciji, pri vdelovanju skupnih podatkov pa usklajevali njihove kopije. Prilagodljiva struktura dokumentov pri predvidenem podatkovnem modelu ne odtehta teh obveznosti.

**PostgreSQL** dodatno omogoča izključitveni omejitvi za preprečevanje prekrivanja terminov stroja in izvajalca. **EF Core z Npgsql** uporabimo za preslikavo C# modelov in migracije; posebni omejitvi dodamo s SQL-om v migraciji.

### Posledice

* **Pozitivno:** Povezave in največ en nalog na naročilo varuje baza, kar zmanjša možnost nekonsistentnih zapisov.
* **Pozitivno:** Omejitvi v PostgreSQL preprečita dvojno rezervacijo tudi ob sočasnih zahtevah.
* **Negativno:** Spremembe strukture tabel in povezav zahtevajo načrtovane migracije.
* **Negativno:** SQL za izključitveni omejitvi je vezan na PostgreSQL in zahteva prilagoditev pri zamenjavi baze.
