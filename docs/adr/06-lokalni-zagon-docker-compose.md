# Lokalni zagon: Docker Compose

## Kontekst in opis problema

Za delovanje StrojnegaNaloga potrebujemo frontend, backend, PostgreSQL in Keycloak. Pri lokalnem zagonu morajo imeti storitve usklajene različice, naslove, porte in dostopne podatke, podatki v bazah pa se morajo ohraniti med ponovnimi zagoni.

## Obravnavane možnosti

* **Ročna namestitev** – Node.js, .NET, PostgreSQL in Keycloak namestimo ter nastavimo na vsakem računalniku.
* **Ločeni ukazi docker run** – storitve tečejo v vsebnikih, omrežje, porte in volumne pa pripravimo z ločenimi ukazi.
* **Docker Compose** – storitve, njihove povezave, nastavitve in volumne opišemo v skupni datoteki.

## Sprejeta odločitev

Izbral sem **Docker Compose**, ker vse štiri storitve zaženemo iz iste konfiguracije. V primerjavi z ročno namestitvijo zmanjšamo razlike med okolji, v primerjavi z ločenimi ukazi docker run pa nastavitve in povezave hranimo skupaj v repozitoriju.

V docker-compose.yml določimo različice slik, porte, omrežje in podatkovni volumen za PostgreSQL z obema bazama. Lokalne nastavitve pripravimo v .env po predlogi .env.example. Pripravljenost odvisnih storitev preverjamo s healthcheck preverjanji; predvideni skupni zagon je docker compose up --build.

### Posledice

* **Pozitivno:** Nov računalnik lahko pripravi isto sestavo storitev brez ponavljanja vseh ročnih namestitev in zagonskih ukazov.
* **Pozitivno:** Podatkovni volumen ohrani naročila in uporabniške račune tudi ob ponovnem ustvarjanju kontejnerja PostgreSQL.
* **Negativno:** Potrebujemo delujoče okolje Docker in dodatne pomnilniške ter diskovne vire.
* **Negativno:** Pri odpravljanju napak moramo upoštevati razliko med naslovi znotraj omrežja kontejnerov in naslovi, dostopnimi iz brskalnika.
