# Frontend: React + TypeScript + Vite

## Kontekst in opis problema

StrojniNalog vsebuje obrazce za naročila, razporejanje in evidenco dela ter sezname s stanji. Po uporabniškem dejanju je treba uskladiti podatke, sporočila in razpoložljive gumbe, zasloni pa se razlikujejo glede na vlogo.

## Obravnavane možnosti

* **React + TypeScript + Vite** – vmesnik iz komponent z upravljanjem stanja.
* **HTML + CSS + JavaScript brez ogrodja** – ročno upravljanje elementov in posodabljanje prikaza.
* **Next.js + TypeScript** – React ogrodje z usmerjanjem in možnostjo strežniškega prikaza.

## Sprejeta odločitev

Izbral sem **React + TypeScript + Vite**, ker lahko obrazec, tabelo naročil in prikaz statusa uporabimo na več zaslonih. React prikaz uskladi s stanjem komponent: po potrditvi naročila posodobimo podatke in temu prilagodimo status ter gumbe. Pri izvedbi brez ogrodja bi te spremembe elementov in njihovo usklajevanje pisali ročno.

TypeScript preverja uporabo podatkovnih tipov med razvojem, Vite pa zagotavlja razvojni strežnik in gradnjo. Strežniških funkcij Next.js ne potrebujemo, saj poslovne operacije že izvaja ASP.NET Core API.

### Posledice

* **Pozitivno:** Skupne komponente zmanjšajo ponavljanje obrazcev, tabel in prikazov statusov.
* **Pozitivno:** Prikaz obrazca, napak in gumbov določimo iz njegovega stanja, kar olajša spreminjanje več povezanih zaslonov.
* **Negativno:** V primerjavi z izvedbo brez ogrodja potrebujemo odvisnosti.
* **Negativno:** Navigacijo z React Routerjem in nalaganje podatkov iz API-ja moramo urediti posebej.
