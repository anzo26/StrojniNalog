# Ločitev poslovne baze od baze Keycloak

## Kontekst in opis problema

StrojniNalog hrani naročila, stroje in delovne naloge, Keycloak pa upravlja račune, gesla in vloge. Strukturo poslovnih podatkov spreminjajo migracije EF Core, strukturo identitetnih podatkov pa nadgradnje Keycloaka.

## Obravnavane možnosti

* **Ena baza in skupna shema** – poslovne tabele in tabele Keycloaka so skupaj.
* **Ena baza z ločenima shemama** – vsaka storitev upravlja svojo skupino tabel.
* **Dve ločeni bazi** – poslovna baza in baza Keycloaka imata vsaka svojega uporabnika ter pravice.

## Sprejeta odločitev

Izbral sem **dve bazi: strojninalog in keycloak**, ki lokalno delujeta v istem PostgreSQL strežniku. Tako lahko poslovno bazo v celoti ponastavimo ali obnovimo brez poseganja v uporabniške račune. Ločeni shemi bi prav tako ločili tabele, vendar bi ponastavitev celotne skupne baze prizadela obe storitvi.

Vsaka storitev dobi uporabnika s pravicami samo za svojo bazo. EF Core upravlja samo poslovne tabele, Keycloak pa svoje. Profil Uporabnik povežemo z identiteto Keycloak prek polja AuthId; backend podatke o vlogah pridobiva prek Keycloakovih vmesnikov.

### Posledice

* **Pozitivno:** Spremembe in ponastavitve poslovne baze ne spreminjajo podatkov za prijavo.
* **Pozitivno:** Backend nima neposrednega dostopa do Keycloakovih tabel z računi in gesli.
* **Negativno:** Pripraviti moramo dve bazi, ločene dostopne podatke.
* **Negativno:** Povezavo prek AuthId preverjamo v aplikaciji; med bazama ne uporabljamo tujih ključev.
* **Negativno:** Obe bazi uporabljata isti PostgreSQL strežnik, zato njegov izpad prizadene obe.
