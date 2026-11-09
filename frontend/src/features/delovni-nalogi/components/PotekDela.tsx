import { StatusDelovnegaNaloga } from '../../../models/enums/StatusDelovnegaNaloga'
import { useBelezenjePoteka } from '../hooks/useBelezenjePoteka'
import type { DelovniNalogPodrobnosti } from '../models/delovniNalogPodrobnosti'
import '../../../components/ui/Button.css'
import './PotekDela.css'

interface PotekDelaProps {
  nalog: DelovniNalogPodrobnosti
  onUspeh: (sporocilo: string) => void
  onOsvezi: () => void
}

export function PotekDela({ nalog, onUspeh, onOsvezi }: PotekDelaProps) {
  const { obdelava, napaka, potrebujeOsvezitev, zacni, koncaj } = useBelezenjePoteka(nalog.id)

  const lahkoZacne =
    nalog.status === StatusDelovnegaNaloga.Nacrtovan &&
    nalog.dejanskiZacetek === null &&
    nalog.dejanskiKonec === null

  const lahkoKonca =
    nalog.status === StatusDelovnegaNaloga.VIzvajanju &&
    nalog.dejanskiZacetek !== null &&
    nalog.dejanskiKonec === null

  const deloKoncano =
    nalog.status === StatusDelovnegaNaloga.VIzvajanju &&
    nalog.dejanskiKonec !== null

  const onemogoceno = obdelava !== null || potrebujeOsvezitev

  async function zabeleziZacetek() {
    if (await zacni()) {
      onUspeh('Začetek dela je bil zabeležen.')
    }
  }

  async function zabeleziKonec() {
    if (await koncaj()) {
      onUspeh('Konec dela je bil zabeležen.')
    }
  }

  if (!nalog.jeDodeljenIzvajalec || (!lahkoZacne && !lahkoKonca && !deloKoncano)) {
    return null
  }

  return (
    <section className="potek-dela" aria-label="Beleženje poteka dela" aria-busy={obdelava !== null}>
      <h2>Potek dela</h2>

      {napaka && (
        <div className="potek-dela__error" role="alert">
          <p>{napaka}</p>
          <button type="button" className="button button--secondary" onClick={onOsvezi}>
            Osveži podatke
          </button>
        </div>
      )}

      {deloKoncano && (
        <p>Konec dela je zabeležen. Sledi oddaja evidence opravljenega dela v pregled.</p>
      )}

      <div className="potek-dela__actions">
        {lahkoZacne && (
          <button
            type="button"
            className="button button--primary"
            disabled={onemogoceno}
            onClick={() => void zabeleziZacetek()}
          >
            {obdelava === 'zacetek' ? 'Beleženje …' : 'Začni delo'}
          </button>
        )}

        {lahkoKonca && (
          <button
            type="button"
            className="button button--primary"
            disabled={onemogoceno}
            onClick={() => void zabeleziKonec()}
          >
            {obdelava === 'konec' ? 'Beleženje …' : 'Zabeleži konec dela'}
          </button>
        )}
      </div>
    </section>
  )
}