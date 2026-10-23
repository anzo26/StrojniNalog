# Backend: ASP.NET Core Web API

## Kontekst in opis problema

Backend mora validirati naročila, preverjati dostop glede na vlogo in izvajati prehode med stanji delovnega naloga. Potrebujemo REST API, preverjanje žetonov Keycloak ter dostop do povezanih podatkov v PostgreSQL.

## Obravnavane možnosti

* **ASP.NET Core (C#) + EF Core** – REST kontrolerji, validacija modelov, preverjanje žetonov in dostop do baze.
* **Spring Boot (Java) + Spring Data JPA** – REST API s Spring Security ter dostopom do baze prek JPA.
* **Node.js (TypeScript) + Express** – osnovni API z dodatno izbranimi knjižnicami za validacijo, preverjanje žetonov in dostop do baze.

## Sprejeta odločitev

Izbral sem **ASP.NET Core**, ker kontrolerji in validacija modelov pokrijejo preverjanje vhodnih podatkov, JWT Bearer preverjanje omogoča povezavo s Keycloakom, EF Core pa preslikavo povezanih entitet in ustvarjanje migracij iz sprememb C# modela.

Pri Expressu bi te dele sestavili iz ločeno izbranih knjižnic. Spring Boot prav tako ustreza zahtevam, vendar bi za različice sheme dodali orodje, kot je Flyway; pri izbranem skladu to zagotavlja EF Core. Poslovne module združimo v en API ter ločimo kontrolerje, poslovne storitve in podatkovni dostop.

### Posledice

* **Pozitivno:** Validacijo zahtev in preverjanje dostopa izvajamo dosledno pred poslovnimi operacijami.
* **Pozitivno:** Ena objava API-ja in migracije ob kodi omogočajo predvidljiv vzdrževalni odtis.
* **Negativno:** Poleg Node.js za frontend potrebujemo še .NET SDK; Express bi omogočal TypeScript na obeh straneh.
* **Negativno:** Posodobitev posameznega poslovnega modula zahteva ponovno objavo celotnega backenda.
