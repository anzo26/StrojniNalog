import { useState } from 'react'
import { useObravnavaNarocila } from '../hooks/useObravnavaNarocila'
import { ZavrnitevNarocilaForm } from './ZavrnitevNarocilaForm'
import '../../../components/ui/Button.css'
import './ObravnavaNarocila.css'

interface ObravnavaNarocilaProps {
  id: number
  onUspeh: (sporocilo: string) => void
  onOsvezi: () => void
}

export function ObravnavaNarocila({ id, onUspeh, onOsvezi }: ObravnavaNarocilaProps) {
  const [prikaziZavrnitev, setPrikaziZavrnitev] = useState(false)
  const [razlog, setRazlog] = useState('')
  const {
    obdelava, napaka, napakaRazloga, zastarelo,
    potrdi, zavrni, pocistiNapakoRazloga,
  } = useObravnavaNarocila(id)

  const jeObdelava = obdelava !== null

  async function potrdiNarocilo() {
    if (await potrdi()) {
      onUspeh('Naročilo je bilo uspešno potrjeno.')
    }
  }

  async function zavrniNarocilo() {
    if (await zavrni(razlog)) {
      onUspeh('Naročilo je bilo uspešno zavrnjeno.')
    }
  }

  function spremeniRazlog(vrednost: string) {
    setRazlog(vrednost)
    pocistiNapakoRazloga()
  }

  function prekliciZavrnitev() {
    setPrikaziZavrnitev(false)
    setRazlog('')
    pocistiNapakoRazloga()
  }

  return (
    <section className="obravnava-narocila" aria-label="Obravnava naročila" aria-busy={jeObdelava}>
      <h2>Obravnava naročila</h2>

      {napaka && (
        <div className="obravnava-narocila__error" role="alert">
          <p>{napaka}</p>
          {zastarelo && (
            <button type="button" className="button button--secondary" onClick={onOsvezi}>
              Osveži podatke
            </button>
          )}
        </div>
      )}

      {!zastarelo && !prikaziZavrnitev && (
        <div className="obravnava-narocila__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => void potrdiNarocilo()}
            disabled={jeObdelava}
          >
            {obdelava === 'potrditev' ? 'Potrjevanje …' : 'Potrdi naročilo'}
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={() => setPrikaziZavrnitev(true)}
            disabled={jeObdelava}
          >
            Zavrni naročilo
          </button>
        </div>
      )}

      {!zastarelo && prikaziZavrnitev && (
        <ZavrnitevNarocilaForm
          razlog={razlog}
          napaka={napakaRazloga}
          obdelava={jeObdelava}
          onSprememba={spremeniRazlog}
          onOddaj={() => void zavrniNarocilo()}
          onPreklic={prekliciZavrnitev}
        />
      )}
    </section>
  )
}