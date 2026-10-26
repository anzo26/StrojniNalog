# Funkcionalnosti in obseg

## Uporabniške vloge

| Vloga | Dovoljena dejanja | Omejitve pravic |
| --- | --- | --- |
| **Naročnik** | Oddaja naročila in spremlja njihovo stanje. | Dostopa samo do svojih naročil. Ne potrjuje naročil, ne razporeja dela in ne ureja evidence izvedbe. |
| **Organizator** | Obravnava vsa naročila, razporeja delo ter preverja in zaključuje naloge. Upravlja ponudbo storitev in stroje. | Ne vnaša izvedbe v imenu izvajalca in ne upravlja uporabniških vlog. |
| **Izvajalec** | Spremlja svoje naloge, označuje potek dela in vnaša izvedbo. | Ne vidi nalogov drugih izvajalcev, ne potrjuje naročil, ne spreminja razporeda in ne opravi končne potrditve naloga. |

## Predvidene funkcionalnosti

Predvidenih je **12 funkcionalnosti**, od tega **7 za MVP**. Funkcionalnosti 8–12 sledijo MVP znotraj projekta.

| Št. | Funkcionalnost | Opis | Obseg |
| --- | --- | --- | --- |
| 1 | **Oddaja naročila za storitev** | Naročnik odda naročilo z vrsto storitve, opisom, lokacijo in želenim terminom. | **MVP** |
| 2 | **Obravnava naročila** | Organizator naročilo potrdi ali zavrne z razlogom. | **MVP** |
| 3 | **Priprava in razporejanje delovnega naloga** | Organizator pripravi delovni nalog in določi termin, stroj ter izvajalca. | **MVP** |
| 4 | **Preverjanje zasedenosti** | Sistem prepreči prekrivanje terminov istega stroja ali izvajalca. | **MVP** |
| 5 | **Spremljanje poteka izvedbe** | Izvajalec označi začetek in zaključek dela; naročnik in organizator spremljata napredek. | **MVP** |
| 6 | **Evidentiranje opravljenega dela** | Izvajalec vnese opravljene ure in opis dela ter evidenco odda v pregled. | **MVP** |
| 7 | **Preverjanje in zaključevanje naloga** | Organizator preveri evidenco, zaključi nalog ali ga z razlogom vrne v dopolnitev. | **MVP** |
| 8 | **Upravljanje ponudbe storitev** | Organizator upravlja vrste storitev in njihovo razpoložljivost za nova naročila. | Kasneje |
| 9 | **Vodenje razpoložljivosti strojev** | Organizator vodi stroje in označi nedostopne, na primer zaradi okvare. | Kasneje |
| 10 | **Zgodovina naročil in izvedb** | Uporabniki pregledujejo zgodovino naročil in izvedb v okviru svojih pravic. | Kasneje |
| 11 | **Koledarski prikaz razporeda** | Organizator v koledarju pregleduje razpored po terminih, strojih in izvajalcih. | Kasneje |
| 12 | **Pregled opravljenih ur** | Organizator pregleduje opravljene ure po obdobju, stroju in izvajalcu. | Kasneje |

## Obseg MVP

MVP pokriva proces: oddaja naročila → obravnava → razporejanje → izvedba → pregled evidence → zaključek. Razporejanje, preprečevanje prekrivanja terminov in preverjanje izvedbe so domensko specifične funkcionalnosti.

- Rešitev uporablja eno podjetje.
- Naročilo zajema eno vrsto storitve in največ en delovni nalog.
- Nalog ima en stroj, enega izvajalca ter predvideni začetek in konec.
- Želeni termin je predlog; dogovorjeni termin določi organizator.
- Registracija naročnikov, prijava in preverjanje pravic so tehnična podlaga MVP.
- Račune zaposlenih pripravi skrbnik v Keycloaku; storitve in stroji so v MVP pripravljeni vnaprej.

## Kasnejše nadgradnje

Možnosti razvoja po tem projektu:

- Več strojev in izvajalcev na enem nalogu.
- Več nalogov za eno naročilo.
- Priprava ponudbe in potrditev cene.
- Fotografije lokacije in izvedbe.
- E-poštna obvestila o spremembah stanja.
- Izvoz delovnega naloga v PDF.

## Izven obsega projekta

- Računovodstvo, davčne evidence in izdajanje računov.
- Spletna plačila.
- GPS-sledenje.
- Platforma za več podjetij oziroma ponudnikov.
- Samodejno optimiziranje razporeda in poti.
- Ločena mobilna aplikacija za Android ali iOS.
