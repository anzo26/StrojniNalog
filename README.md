# StrojniNalog

Spletna aplikacija za naročanje in organizacijo storitev z gradbeno mehanizacijo. Naročnik odda naročilo, organizator pripravi delovni nalog, izvajalec evidentira delo, organizator pa evidenco potrdi ali vrne v dopolnitev.

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

## Lokalni zagon z Docker Compose

Potrebujete Git in zagnan Docker Desktop z Docker Compose. Lokalna namestitev .NET, Node.js in PostgreSQL za ta način zagona ni potrebna.

### 1. Priprava

```bash
git clone https://github.com/anzo26/StrojniNalog.git
cd StrojniNalog
cp .env.example .env
```

V korenski `.env` nastavite svoje vrednosti za:

- `POSTGRES_PASSWORD` – geslo skrbnika PostgreSQL;
- `APP_DB_PASSWORD` – geslo uporabnika poslovne baze;
- `KEYCLOAK_DB_PASSWORD` – geslo uporabnika Keycloakove baze;
- `KEYCLOAK_ADMIN_PASSWORD` – geslo začetnega skrbnika Keycloaka;
- `KEYCLOAK_SERVICE_CLIENT_SECRET` – skrivnost servisnega odjemalca backenda.

### 2. Zagon

Vse ukaze izvajajte iz korenske mape repozitorija:

```bash
docker compose up -d --build
docker compose ps -a
```

Prvi zagon pripravi ločeni bazi in uporabnika za poslovne podatke ter Keycloak, izvede EF migracije, doda začetne stroje in vrste storitev ter uvozi realm. Počakajte, da imajo `postgres`, `keycloak`, `backend` in `frontend` stanje `healthy`. Pripravljalni storitvi se zaključita z `Exited (0)`.

| Storitev | Lokalni naslov |
| --- | --- |
| Aplikacija | http://localhost:5173 |
| API | http://localhost:5176 |
| Preverjanje backenda in povezave z bazo | http://localhost:5176/health/ready |
| Keycloak | http://localhost:8080 |
| PostgreSQL | `localhost:5432` |

Frontend uporablja privzeti port `5173`, ki je dovoljen tudi v nastavitvah Keycloaka in CORS. Sprememba javnih portov zahteva uskladitev povezanih nastavitev in ponovno gradnjo frontenda.

### 3. Računi za preverjanje

Poslovni računi niso vključeni v izvoz. Naročnik se registrira prek aplikacije in samodejno dobi vlogo `narocnik`.

Za zaposlene odprite Keycloak in se prijavite z `KEYCLOAK_ADMIN` ter `KEYCLOAK_ADMIN_PASSWORD` iz `.env`. V realmu `strojninalog` pod **Users**:

1. Ustvarite organizatorja in dva izvajalca; vnesite ime, priimek in e-pošto.
2. Nastavite gesla z možnostjo **Temporary: Off**.
3. V **Role mapping** odstranite `default-roles-strojninalog` in morebitno neposredno vlogo `narocnik`.
4. Organizatorju dodelite vlogo `organizator`, izvajalcema pa `izvajalec`.
5. Za uporabo upravljanja profila zaposlenim dodelite še client vlogi `manage-account` in `view-profile` odjemalca `account`.

Preverite potek: oddaja naročila → potrditev in priprava naloga → začetek in konec dela → oddaja evidence → vrnitev v dopolnitev ali potrditev in zaključek.

### Ustavitev in ponovni zagon

```bash
docker compose down
docker compose up -d
```

Po spremembah kode ponovno uporabite `docker compose up -d --build`.

Realm se bere iz `docker/keycloak/strojninalog-realm.json`. Če že obstaja, se uvoz preskoči; sprememba datoteke ne posodobi obstoječega realma. Servisni račun in njegove bralne pravice so vključeni v konfiguracijo.

### Če gradnja javi `additional privileges requested`

Če Docker Bake zavrne dostop do gradbenega konteksta, lahko sliki za privzete porte zgradite neposredno in nato zaženete Compose:

```bash
docker build -t strojninalog-api:local ./backend
docker build -t strojninalog-web:local \
  --build-arg VITE_API_URL=http://localhost:5176 \
  --build-arg VITE_KEYCLOAK_URL=http://localhost:8080 \
  --build-arg VITE_KEYCLOAK_REALM=strojninalog \
  --build-arg VITE_KEYCLOAK_CLIENT_ID=strojninalog-frontend ./frontend
docker compose up -d --no-build
```

## Razvoj brez vsebnikov za API in frontend

Dodatno potrebujete .NET SDK 10, Node.js 24 z npm in orodje `dotnet-ef` 10, usklajeno z EF Core v projektu. Če orodja še ni, ga namestite z `dotnet tool install --global dotnet-ef --version "10.*"`.

```bash
docker compose stop frontend backend
docker compose up -d postgres app-db-init keycloak
cp frontend/.env.example frontend/.env
```

V `frontend/.env` preverite nastavitve `VITE_*`. Backend korenske `.env` pri neposrednem lokalnem zagonu ne bere; povezavo in servisno skrivnost nastavite z User Secrets:

```bash
dotnet user-secrets set 'ConnectionStrings:DefaultConnection' 'Host=localhost;Port=5432;Database=strojninalog;Username=strojninalog_app;Password=TVOJE_GESLO' --project backend/StrojniNalog.Api.csproj
dotnet user-secrets set 'KeycloakAdmin:ClientSecret' 'TVOJ_CLIENT_SECRET' --project backend/StrojniNalog.Api.csproj
dotnet ef database update --project backend/StrojniNalog.Api.csproj -- --environment Development
dotnet watch --project backend/StrojniNalog.Api.csproj
```

Geslo in secret zamenjajte z vrednostma `APP_DB_PASSWORD` in `KEYCLOAK_SERVICE_CLIENT_SECRET` iz korenske `.env`. Če ste spremenili ime baze, uporabnika ali port, prilagodite tudi povezavo.

V drugem terminalu:

```bash
cd frontend
npm ci
npm run dev
```

Oba načina zagona uporabljata iste podatke. Pred prehodom nazaj na celoten Compose ustavite lokalna procesa, da sprostite porte.

## Trenutno stanje

Implementirane so funkcionalnosti MVP US-01–US-07: prijava in dostop po vlogah, naročila, razporejanje brez prekrivanja terminov stroja ali izvajalca, spremljanje izvedbe ter oddaja in obravnava evidence. Celotno aplikacijo zaganja Docker Compose; frontend in backend je mogoče razvijati tudi lokalno.