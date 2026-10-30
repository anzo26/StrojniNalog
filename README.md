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

## Lokalni razvoj

### Predpogoji
- .NET SDK 10
- Node.js 24 in npm
- Docker z Docker Compose
- Orodje dotnet-ef 10, usklajeno z različico EF Core v projektu

Vse ukaze izvajamo iz korenske mape repozitorija, razen kjer je navedeno drugače.

### 1. Nastavitve okolja
Datoteko `.env.example` kopirajte v `.env`.

V `.env` nastavite `POSTGRES_PASSWORD` in po potrebi spremenite `POSTGRES_PORT`. Datoteka `.env` se ne vključuje v Git.

### 2. Zagon PostgreSQL
Zaženite Docker in izvedite:

```bash
docker compose up -d
```

### 3. Povezava backenda z bazo
Povezavo lokalno shranite v .NET User Secrets:

```bash
dotnet user-secrets set 'ConnectionStrings:DefaultConnection' 'Host=localhost;Port=5432;Database=strojninalog;Username=postgres;Password=TVOJE_GESLO' --project backend/StrojniNalog.Api.csproj
```

`TVOJE_GESLO` zamenjajte z geslom iz `.env`. Če uporabljate drug port, prilagodite tudi `Port`.

Backend pri neposrednem lokalnem zagonu datoteke `.env` ne bere samodejno.

### 4. Priprava baze
Namestite orodje dotnet-ef 10, če še ni nameščeno:

```bash
dotnet tool install --global dotnet-ef --version "10.*"
```

Izvedite migracije:

```bash
dotnet ef database update --project backend/StrojniNalog.Api.csproj -- --environment Development
```

Ukaz ustvari tabele in doda začetne vrste storitev ter stroje. Ponovno izvajanje ne podvoji nespremenjenih začetnih podatkov.

### 5. Zagon backenda
```bash
dotnet run --project backend/StrojniNalog.Api.csproj
```

### 6. Zagon frontenda
V drugem terminalu odprite mapo `frontend` in izvedite:

```bash
npm ci
npm run dev
```

## Trenutno stanje
Pripravljeni so osnova frontenda in backenda, poslovna baza, migracije ter začetni podatki.

Docker Compose trenutno zaganja PostgreSQL. Skupni zagon vseh storitev, Keycloak in poslovne funkcionalnosti sledijo v nadaljnjih razvojnih nalogah.
