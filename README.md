# StrojniNalog

Spletna rešitev za naročanje in organizacijo storitev z gradbeno mehanizacijo. Naročnik odda naročilo, organizator ga obravnava ter določi termin, stroj in izvajalca. Izvajalec evidentira opravljeno delo, organizator pa evidenco pregleda in zaključi delovni nalog.

Projekt je trenutno v fazi priprave dokumentacije in načrtovanja implementacije.

## Predvidene tehnologije

| Del rešitve | Tehnologije |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | C#, ASP.NET Core Web API, Entity Framework Core |
| Podatkovna baza | PostgreSQL |
| Avtentikacija | Keycloak, OpenID Connect |
| Lokalni razvoj | Docker, Docker Compose |
| Dokumentacija API | OpenAPI |

## Dokumentacija

- [01 – Zasnova rešitve](docs/01-zasnova-resitve.md)
- [02 – Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [03 – Podatkovni model](docs/03-podatkovni-model.md)
- [04 – Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [05 – Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [06 – Wireframe-i](docs/06-wireframes.md)
- [Arhitekturne odločitve – ADR](docs/adr/)

## Struktura projekta

- `frontend/` – uporabniški vmesnik.
- `backend/` – API, poslovna pravila in dostop do podatkov.
- `docs/` – projektna dokumentacija, wireframe-i in ADR.

## Razvojni proces

Razvoj poteka po strategiji GitHub Flow. Spremembe pripravljamo na ločenih delovnih vejah in jih v `main` združujemo prek pull requestov.
