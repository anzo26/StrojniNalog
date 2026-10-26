# Uporabniške zgodbe

## US-01: Oddaja naročila za storitev

- **Povezana funkcionalnost:** 1 – Oddaja naročila za storitev.
- **Uporabniška vloga:** Naročnik

**Uporabniška zgodba:**  
Kot naročnik želim oddati naročilo z opisom storitve, lokacijo in želenim terminom, da lahko podjetje obravnava mojo zahtevo in načrtuje izvedbo.

**Acceptance criteria:**

1. Prijavljeni naročnik lahko izbere eno aktivno vrsto storitve ter vnese opis dela, lokacijo in želeni termin.
2. Če kateri od zahtevanih podatkov manjka ali termin ni veljaven datum in čas, sistem naročila ne shrani in označi neustrezen podatek.
3. Ob uspešni oddaji sistem ustvari naročilo s stanjem `ODDANO`, ga poveže s prijavljenim naročnikom in zabeleži datum oddaje.
4. Naročnik po uspešni oddaji prejme potrditev z identifikatorjem naročila.

## US-02: Obravnava naročila

- **Povezana funkcionalnost:** 2 – Potrditev ali zavrnitev naročila.
- **Uporabniška vloga:** Organizator

**Uporabniška zgodba:**  
Kot organizator želim potrditi ali zavrniti oddano naročilo, da naročniku sporočim, ali bo podjetje prevzelo izvedbo storitve.

**Acceptance criteria:**

1. Odločanje o naročilu je omogočeno samo organizatorju in samo za naročila v stanju `ODDANO`.
2. Ob potrditvi sistem spremeni stanje naročila v `POTRJENO`.
3. Ob zavrnitvi organizator vnese razlog, sistem pa shrani razlog in spremeni stanje v `ZAVRNJENO`.
4. Če je razlog zavrnitve prazen, sistem prikaže zahtevo za vnos razloga in stanje ostane `ODDANO`.
5. Naročnik vidi odločitev pri svojem naročilu; pri zavrnjenem naročilu vidi tudi razlog.

## US-03: Priprava in razporejanje delovnega naloga

- **Povezana funkcionalnost:** 3 – Priprava delovnega naloga in določitev termina, stroja ter izvajalca.
- **Uporabniška vloga:** Organizator

**Uporabniška zgodba:**  
Kot organizator želim za potrjeno naročilo pripraviti delovni nalog s terminom, strojem in izvajalcem, da določim, kdo bo delo opravil, s katerim strojem in kdaj.

**Acceptance criteria:**

1. Organizator lahko pripravi nalog samo za naročilo v stanju `POTRJENO`, ki še nima delovnega naloga.
2. Za shranjevanje so obvezni en razpoložljiv stroj, en uporabnik z vlogo izvajalca ter predvideni začetek in konec izvedbe.
3. Če predvideni konec ni po začetku, sistem prikaže napako in naloga ne shrani.
4. Če sta stroj in izvajalec v izbranem terminu prosta, sistem shrani nalog v stanju `NACRTOVAN` ter ga poveže z naročilom in izbranima viroma.
5. Poskus ustvarjanja drugega naloga za isto naročilo je zavrnjen; obstoječi nalog ostane nespremenjen.

## US-04: Preverjanje zasedenosti

- **Povezana funkcionalnost:** 4 – Preprečevanje prekrivanja terminov stroja ali izvajalca.
- **Uporabniška vloga:** Organizator

**Uporabniška zgodba:**  
Kot organizator želim preveriti zasedenost izbranega stroja in izvajalca, da istega vira ne razporedim na več nalogov v prekrivajočih se terminih.

**Acceptance criteria:**

1. Če se predvideni termin prekriva s terminom drugega naloga istega stroja, sistem prepreči shranjevanje razporeda.
2. Če se predvideni termin prekriva s terminom drugega naloga istega izvajalca, sistem prepreči shranjevanje razporeda.
3. Termin, ki se začne natanko ob koncu drugega termina, je dovoljen, če ni drugih konfliktov.
4. Ob zavrnitvi sistem navede, ali je zaseden stroj, izvajalec ali oba; zavrnjeni razpored se ne shrani.
5. Če dva organizatorja sočasno poskusita rezervirati isti prosti vir v prekrivajočem se terminu, je shranjena samo ena rezervacija, drugi poskus pa prejme obvestilo o konfliktu.

## US-05: Spremljanje poteka izvedbe

- **Povezana funkcionalnost:** 5 – Označevanje začetka in zaključka dela ter spremljanje napredka.
- **Uporabniška vloga:** Izvajalec; naročnik in organizator spremljata stanje

**Uporabniška zgodba:**  
Kot izvajalec želim označiti začetek in zaključek dodeljenega dela, da je potek izvedbe evidentiran ter viden naročniku in organizatorju.

**Acceptance criteria:**

1. Izvajalec vidi svoje dodeljene naloge s stanjem in predvidenim terminom.
2. Ob začetku naloga v stanju `NACRTOVAN` sistem zabeleži dejanski začetek in spremeni stanje v `V_IZVAJANJU`.
3. Zaključek dela je mogoče označiti šele po začetku. Sistem zabeleži dejanski konec, ki ne sme biti pred začetkom; nalog ostane `V_IZVAJANJU` do oddaje evidence v pregled po US-06.
4. Naročnik vidi trenutno stanje naloga pri svojem naročilu, organizator pa lahko spremlja stanja vseh nalogov.
5. Poskus označitve začetka ali zaključka naloga, ki pripada drugemu izvajalcu, je zavrnjen in podatki ostanejo nespremenjeni.

## US-06: Evidentiranje opravljenega dela

- **Povezana funkcionalnost:** 6 – Vnos opravljenih ur in opisa dela ter oddaja evidence v pregled.
- **Uporabniška vloga:** Izvajalec

**Uporabniška zgodba:**  
Kot izvajalec želim vnesti opravljene ure in opis izvedbe ter oddati evidenco v pregled, da organizator lahko preveri opravljeno delo.

**Acceptance criteria:**

1. Izvajalec lahko vnaša in spreminja evidenco samo pri svojih nalogih v stanju `V_IZVAJANJU` ali `V_DOPOLNITVI`.
2. Opravljene ure morajo biti pozitivno število, opis izvedbe pa ne sme biti prazen. Neustrezen vnos prepreči oddajo in sproži sporočilo o napaki.
3. Oddaja evidence je zavrnjena, če manjka dejanski začetek ali konec oziroma je konec pred začetkom.
4. Ob uspešni oddaji se podatki shranijo, stanje naloga pa se spremeni v `CAKA_NA_PREGLED`.
5. Izvajalec ne more spreminjati evidence, dokler nalog čaka na pregled ali je že zaključen.

## US-07: Preverjanje in zaključevanje naloga

- **Povezana funkcionalnost:** 7 – Pregled evidence, zaključek naloga ali vrnitev v dopolnitev.
- **Uporabniška vloga:** Organizator

**Uporabniška zgodba:**  
Kot organizator želim preveriti oddano evidenco in nalog zaključiti ali vrniti v dopolnitev, da so zaključene izvedbe podprte s potrjenimi podatki o opravljenem delu.

**Acceptance criteria:**

1. Samo organizator lahko potrjuje ali vrača evidenco nalogov v stanju `CAKA_NA_PREGLED`; pri pregledu vidi dejanske čase, opravljene ure in opis izvedbe.
2. Ob potrditvi evidence sistem spremeni stanje naloga v `ZAKLJUCEN`.
3. Ob vrnitvi organizator vnese razlog, sistem ga shrani in spremeni stanje v `V_DOPOLNITVI`.
4. Če razlog dopolnitve manjka, sistem vrnitev zavrne in stanje ostane `CAKA_NA_PREGLED`.
5. Dodeljeni izvajalec vidi razlog vrnitve ter lahko popravi evidenco in jo ponovno odda v pregled po US-06.

## US-08: Upravljanje ponudbe storitev

- **Povezana funkcionalnost:** 8 – Upravljanje vrst storitev in njihove razpoložljivosti za nova naročila.
- **Uporabniška vloga:** Organizator

**Uporabniška zgodba:**  
Kot organizator želim urejati vrste storitev in določati, katere so aktivne, da naročniki lahko naročajo samo storitve, ki jih podjetje trenutno ponuja.

**Acceptance criteria:**

1. Samo organizator lahko ustvari vrsto storitve ter spremeni njen naziv, opis in oznako aktivnosti.
2. Če naziv storitve manjka, sistem spremembe zavrne in prikaže zahtevo za vnos naziva.
3. Neaktivna storitev ni na voljo pri oddaji novega naročila; tudi neposredna zahteva za novo naročilo z neaktivno storitvijo je zavrnjena.
4. Po ponovni aktivaciji je storitev znova na voljo za nova naročila.
5. Deaktiviranje storitve ohrani njeno povezavo z obstoječimi naročili in omogoča prikaz storitve pri teh naročilih.

## US-09: Vodenje razpoložljivosti strojev

- **Povezana funkcionalnost:** 9 – Vodenje strojev in označevanje njihove nedostopnosti.
- **Uporabniška vloga:** Organizator

**Uporabniška zgodba:**  
Kot organizator želim voditi podatke o strojih in označiti nedostopne stroje, da za nova dela ne razporedim stroja, ki ga ni mogoče uporabljati.

**Acceptance criteria:**

1. Samo organizator lahko ustvari stroj ter ureja njegovo oznako, naziv, opis in razpoložljivost.
2. Manjkajoča oznaka ali naziv oziroma oznaka, ki jo že uporablja drug stroj, prepreči shranjevanje in sproži sporočilo o napaki.
3. Stroj z oznako `Razpolozljiv = false` ni na voljo za dodelitev novemu nalogu; neposredna zahteva za tako dodelitev je zavrnjena.
4. Po spremembi na `Razpolozljiv = true` je stroj znova mogoče dodeliti, če je prost v izbranem terminu.
5. Označitev stroja kot nedostopnega ne izbriše obstoječih nalogov ali njihove povezave s strojem.

## US-10: Zgodovina naročil in izvedb

- **Povezana funkcionalnost:** 10 – Pregled zgodovine naročil in izvedb v okviru uporabniških pravic.
- **Uporabniška vloga:** Naročnik, organizator ali izvajalec

**Uporabniška zgodba:**  
Kot uporabnik (naročnik, organizator ali izvajalec) želim pregledati zgodovino naročil in izvedb, do katerih imam dostop, da lahko preverim pretekle obravnave in opravljeno delo.

**Acceptance criteria:**

1. Zgodovina zajema zavrnjena naročila in izvedbe z nalogom v stanju `ZAKLJUCEN`.
2. Naročnik vidi samo zgodovino svojih naročil in povezanih izvedb.
3. Izvajalec vidi samo zgodovino zaključenih nalogov, ki so mu bili dodeljeni.
4. Organizator vidi zgodovino vseh zavrnjenih naročil in zaključenih izvedb podjetja.
5. Pri izbranem zapisu so prikazani vrsta storitve, lokacija in končno stanje; pri izvedenem delu tudi opravljene ure in opis izvedbe, pri zavrnitvi pa razlog zavrnitve.

## US-11: Koledarski prikaz razporeda

- **Povezana funkcionalnost:** 11 – Koledarski pregled nalogov po terminih, strojih in izvajalcih.
- **Uporabniška vloga:** Organizator

**Uporabniška zgodba:**  
Kot organizator želim v koledarju pregledati razpored nalogov po strojih in izvajalcih, da lahko za izbrano obdobje pregledam načrtovano delo.

**Acceptance criteria:**

1. Koledarski pregled je dostopen samo organizatorju in omogoča izbiro dneva ali obdobja.
2. Prikazani so nalogi, katerih predvideni termin se vsaj delno prekriva z izbranim obdobjem.
3. Vsak prikazan nalog vsebuje identifikator, predvideni začetek in konec, dodeljeni stroj ter izvajalca.
4. Filtriranje po stroju ali izvajalcu prikaže samo naloge za izbrani vir; če sta izbrana oba filtra, mora nalog ustrezati obema.
5. Če izbranemu obdobju in filtrom ne ustreza noben nalog, koledar prikaže sporočilo, da za izbor ni načrtovanih nalogov.

## US-12: Pregled opravljenih ur

- **Povezana funkcionalnost:** 12 – Pregled opravljenih ur po obdobju, stroju in izvajalcu.
- **Uporabniška vloga:** Organizator

**Uporabniška zgodba:**  
Kot organizator želim pregledati opravljene ure po obdobju, stroju in izvajalcu, da lahko ocenim obseg opravljenega dela v podjetju.

**Acceptance criteria:**

1. Pregled je dostopen samo organizatorju, ki lahko določi začetni in končni datum obdobja.
2. Izračun vključuje samo naloge v stanju `ZAKLJUCEN`, katerih dejanski konec spada v izbrano obdobje; izbrana datuma sta vključena.
3. Za vsak stroj se prikaže vsota vrednosti `OpravljeneUre` iz vključenih nalogov, dodeljenih temu stroju.
4. Za vsakega izvajalca se prikaže vsota vrednosti `OpravljeneUre` iz vključenih nalogov, dodeljenih temu izvajalcu.
5. Če v obdobju ni ustreznih nalogov, je skupno število ur 0 in sistem prikaže sporočilo, da za obdobje ni zaključenih izvedb.
