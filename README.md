# StrojniNalog

Spletna rešitev za naročanje in organizacijo storitev z gradbeno mehanizacijo. Naročnik odda naročilo, organizator ga obravnava ter določi termin, stroj in izvajalca. Izvajalec evidentira opravljeno delo, organizator pa evidenco pregleda in zaključi delovni nalog.

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

Nastavite:
- `POSTGRES_PASSWORD` – geslo skrbnika PostgreSQL;
- `KEYCLOAK_DB_PASSWORD` – geslo uporabnika baze Keycloak;
- `KEYCLOAK_ADMIN_PASSWORD` – geslo začetnega skrbnika Keycloaka.

Po potrebi prilagodite `POSTGRES_PORT` in `KEYCLOAK_PORT`.

### 2. Zagon PostgreSQL in Keycloaka
Zaženite Docker in izvedite:

```bash
docker compose up -d
```

Storitev `keycloak-db-init` pripravi bazo in uporabnika Keycloaka.

### 3. Povezava backenda z bazo
Povezavo lokalno shranite v .NET User Secrets:

```bash
dotnet user-secrets set 'ConnectionStrings:DefaultConnection' 'Host=localhost;Port=5432;Database=strojninalog;Username=postgres;Password=TVOJE_GESLO' --project backend/StrojniNalog.Api.csproj
```

`TVOJE_GESLO` zamenjajte z vrednostjo `POSTGRES_PASSWORD` iz `.env`. Če uporabljate drug port ali uporabnika, prilagodite tudi `Port` in `Username`.

### 4. Priprava poslovne baze
Namestite orodje dotnet-ef 10, če še ni nameščeno:

```bash
dotnet tool install --global dotnet-ef --version "10.*"
```

Izvedite migracije:

```bash
dotnet ef database update --project backend/StrojniNalog.Api.csproj -- --environment Development
```

Ukaz ustvari tabele in doda začetne vrste storitev ter stroje.

### 5. Priprava Keycloaka
Skrbniška konzola je dostopna na [http://localhost:8080](http://localhost:8080). Če je `KEYCLOAK_PORT` spremenjen, uporabite nastavljeni port.

Ob prvi pripravi:
1. Prijavite se z vrednostma `KEYCLOAK_ADMIN` in `KEYCLOAK_ADMIN_PASSWORD` iz `.env`.
2. V realmu `master` ustvarite trajnega skrbnika, nastavite geslo z izključeno možnostjo `Temporary` in mu dodelite realm vlogo `admin`.
3. Preverite prijavo novega skrbnika in nato odstranite začasnega.

Realm `strojninalog` se ob prvem zagonu uvozi iz `docker/keycloak/strojninalog-realm.json`. Če že obstaja, se uvoz preskoči. Spremembe datoteke zato ne posodobijo obstoječega realma.

Realm vsebuje poslovne vloge, nastavitve registracije ter odjemalca `strojninalog-frontend` in `strojninalog-api`.

Uporabniki niso vključeni v izvoz. Naročniki se registrirajo sami in dobijo poslovno vlogo `narocnik`.

Račune zaposlenih v realmu `strojninalog` pripravi skrbnik:
- ustvari uporabnika ter vnese ime, priimek in e-pošto;
- odstrani dodelitev `default-roles-strojninalog` in morebitno neposredno vlogo `narocnik`;
- dodeli eno poslovno vlogo: `organizator` ali `izvajalec`;
- dodeli client vlogi `manage-account` in `view-profile` odjemalca `account`;
- nastavi geslo in izklopi možnost `Temporary`.

Gesla se nastavijo lokalno in se ne vključujejo v Git.

### Servisni dostop backenda do Keycloaka

Backend uporablja Keycloak Admin API za pridobivanje izvajalcev in
preverjanje njihove vloge pri pripravi delovnega naloga.

V realmu `strojninalog` mora obstajati odjemalec
`strojninalog-admin-reader`. Če ga uvoženi realm še ne vsebuje,
ga ustvarite prek `Clients → Create client`.

Nastavitve odjemalca:
- Client type: `OpenID Connect`;
- Client authentication: vključeno;
- Service accounts roles: vključeno;
- Authorization: izključeno;
- Standard flow, Direct access grants in ostali prijavni tokovi: izključeni.

V zavihku `Service account roles` dodelite naslednje vloge
odjemalca `realm-management`:
- `query-users`;
- `view-users`;
- `view-realm`.

Odprite `Client scopes → strojninalog-admin-reader-dedicated → Scope`.
Izključite `Full scope allowed` in med dovoljene vloge dodajte
iste tri vloge odjemalca `realm-management`.

Nastavitve lokalne povezave so v `backend/appsettings.Development.json`:

```json
"KeycloakAdmin": {
  "BaseUrl": "http://localhost:8080",
  "Realm": "strojninalog",
  "ClientId": "strojninalog-admin-reader"
}
```

Če uporabljate drug port Keycloaka, prilagodite `BaseUrl`.

V zavihku `Credentials` kopirajte trenutni `Client secret` in ga
iz korenske mape repozitorija shranite v .NET User Secrets:

```bash
dotnet user-secrets set 'KeycloakAdmin:ClientSecret' 'TVOJ_CLIENT_SECRET' --project backend/StrojniNalog.Api.csproj
```

`TVOJ_CLIENT_SECRET` zamenjajte z dejansko vrednostjo.
Skrivnost se ne vključuje v Git ali frontend.

Nastavitve pripravite pred zagonom backenda.
Po spremembi skrivnosti backend ponovno zaženite.

### 6. Zagon backenda
Pred zagonom pripravite servisni dostop do Keycloaka po navodilih
v razdelku »Servisni dostop backenda do Keycloaka«.

```bash
dotnet run --project backend/StrojniNalog.Api.csproj
```

### 7. Zagon frontenda
V drugem terminalu odprite mapo `frontend` in izvedite:

```bash
npm ci
npm run dev
```

Pred prvim zagonom kopirajte `frontend/.env.example` v `frontend/.env`.
Preverite naslov API-ja ter URL, realm in Client ID Keycloaka.
`VITE_API_URL` mora ustrezati naslovu lokalnega backenda.


## Trenutno stanje

Implementirani so prijava prek Keycloaka, preverjanje uporabniških
vlog, oddaja naročila ter pregled in obravnava naročil.

Naročnik pregleduje svoja naročila, organizator pa vsa.
Organizator lahko potrdi ali z obveznim razlogom zavrne naročilo
v stanju ODDANO.

API omogoča pripravo delovnega naloga za potrjeno naročilo.
Preverja razpoložljivost stroja, aktivnost in vlogo izvajalca,
veljavnost termina ter preprečuje več nalogov za isto naročilo.

Organizator lahko prek obrazca za potrjeno naročilo pripravi
delovni nalog z izbiro stroja, izvajalca in predvidenega termina.
Po ustvarjanju lahko pregleduje nalog in njegov status.

Obrazec ob konfliktu prikaže, ali je zaseden stroj, izvajalec
ali oba. Vneseni podatki ostanejo ohranjeni.

Ponovna oddaja je omogočena po spremembi termina, stroja ali
izvajalca. Backend pri novem poskusu ponovno preveri zasedenost.
Potrditev ustvarjenega naloga se prikaže šele po uspešnem shranjevanju.

API omogoča pregled nalogov glede na uporabniške pravice:
organizator vidi vse naloge, izvajalec svoje dodeljene naloge,
naročnik pa naloge pri svojih naročilih.

Dodeljeni izvajalec lahko prek API-ja enkrat zabeleži začetek
in konec dela. Čas določi strežnik. Začetek spremeni
status v V_IZVAJANJU, beleženje konca pa ta status ohrani
do oddaje evidence v pregled.

Izvajalec lahko v uporabniškem vmesniku pregleduje svoje naloge,
odpre podrobnosti ter zabeleži začetek in konec dela.
Prikazani so predvideni in dejanski časi ter trenutno stanje.

Naročnik vidi napredek pri svojem naročilu, organizator pa lahko
spremlja vse naloge. Po koncu dela status ostane V_IZVAJANJU do oddaje evidence.

API omogoča dodeljenemu izvajalcu shranjevanje osnutka evidence
in oddajo opravljenega dela v pregled.

Evidenco je mogoče urejati v stanju V_IZVAJANJU ali V_DOPOLNITVI.
Ob oddaji so obvezni pozitivne opravljene ure do največ 1000,
neprazen opis ter veljavno zabeležena dejanska začetek in konec.

Uspešna oddaja shrani evidenco in spremeni status v CAKA_NA_PREGLED.
Neveljavne zahteve ohranijo prejšnje podatke in stanje. Organizator lahko evidenco bere.

Docker Compose zaganja PostgreSQL in Keycloak.
Backend in frontend se trenutno zaganjata lokalno.