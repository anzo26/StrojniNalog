import { InputField } from '../../../components/ui/InputField'
import { TextareaField } from '../../../components/ui/TextareaField'
import { StatusDelovnegaNaloga } from '../../../models/enums/StatusDelovnegaNaloga'
import type { useEvidencaDela } from '../hooks/useEvidencaDela'
import type { DelovniNalogPodrobnosti } from '../models/delovniNalogPodrobnosti'
import type { EvidencaDelaDejanje } from '../models/evidencaDelaForm'
import '../../../components/ui/Button.css'
import './EvidencaDelaObrazec.css'

interface EvidencaDelaObrazecProps {
  nalog: DelovniNalogPodrobnosti
  obrazec: ReturnType<typeof useEvidencaDela>
  onUspeh: (sporocilo: string) => void
}

export function EvidencaDelaObrazec({
  nalog,
  obrazec,
  onUspeh,
}: EvidencaDelaObrazecProps) {
  const {
    evidenca,
    values,
    errors,
    submitError,
    nalaganje,
    napakaNalaganja,
    dejanje,
    jeOddano,
    setField,
    izvedi,
    ponoviNalaganje,
  } = obrazec

  const urejanjeDovoljeno =
    nalog.jeDodeljenIzvajalec &&
    !jeOddano &&
    (
      nalog.status === StatusDelovnegaNaloga.VIzvajanju ||
      nalog.status === StatusDelovnegaNaloga.VDopolnitvi
    )

  const posiljanje = dejanje !== null

  async function obDejanju(izbranoDejanje: EvidencaDelaDejanje) {
    const uspeh = await izvedi(izbranoDejanje, nalog)

    if (uspeh) {
      onUspeh(
        izbranoDejanje === 'oddaj'
          ? 'Evidenca je bila uspešno oddana v pregled.'
          : 'Evidenca dela je bila shranjena.',
      )
    }
  }

  return (
    <section className="evidenca-dela" aria-labelledby="evidenca-dela-title">
      <h2 id="evidenca-dela-title">Evidenca opravljenega dela</h2>

      {nalaganje && <p role="status">Nalaganje evidence …</p>}

      {!nalaganje && napakaNalaganja && (
        <div className="evidenca-dela__error" role="alert">
          <p>{napakaNalaganja}</p>
          <button
            type="button"
            className="button button--secondary"
            onClick={ponoviNalaganje}
          >
            Poskusi ponovno
          </button>
        </div>
      )}

      {!nalaganje && !napakaNalaganja && evidenca && (
        <>
          {nalog.status === StatusDelovnegaNaloga.VDopolnitvi &&
            evidenca.razlogDopolnitve && (
              <div className="evidenca-dela__notice">
                <h3>Evidenca je vrnjena v dopolnitev</h3>
                <p>{evidenca.razlogDopolnitve}</p>
              </div>
            )}

          {urejanjeDovoljeno ? (
            <form
              className="evidenca-dela__form"
              noValidate
              aria-busy={posiljanje}
              onSubmit={event => {
                event.preventDefault()
                void obDejanju('oddaj')
              }}
            >
              <fieldset disabled={posiljanje}>
                <legend className="evidenca-dela__legend">
                  Podatki evidence
                </legend>

                <InputField
                  id="evidenca-opravljene-ure"
                  label="Opravljene ure"
                  type="text"
                  inputMode="decimal"
                  value={values.opravljeneUre}
                  error={errors.opravljeneUre}
                  hint="Za oddajo vnesite več kot 0 in največ 1000 ur, na primer 3,5."
                  onChange={event =>
                    setField('opravljeneUre', event.target.value)
                  }
                />

                <TextareaField
                  id="evidenca-opis-izvedbe"
                  label="Opis izvedbe"
                  rows={6}
                  value={values.opisIzvedbe}
                  error={errors.opisIzvedbe}
                  hint="Za oddajo v pregled je opis obvezen."
                  onChange={event =>
                    setField('opisIzvedbe', event.target.value)
                  }
                />
              </fieldset>

              <p className="evidenca-dela__hint">
                Osnutek lahko shranite tudi z neizpolnjenimi polji.
                Za oddajo v pregled morata biti zabeležena začetek in konec dela.
              </p>

              {submitError && (
                <div className="evidenca-dela__error" role="alert">
                  {submitError}
                </div>
              )}

              <div className="evidenca-dela__actions">
                <button
                  type="button"
                  className="button button--secondary"
                  disabled={posiljanje}
                  onClick={() => void obDejanju('shrani')}
                >
                  {dejanje === 'shrani' ? 'Shranjevanje …' : 'Shrani osnutek'}
                </button>

                <button
                  type="submit"
                  className="button button--primary"
                  disabled={posiljanje}
                >
                  {dejanje === 'oddaj' ? 'Oddajanje …' : 'Oddaj v pregled'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl className="evidenca-dela__podatki">
                <div>
                  <dt>Opravljene ure</dt>
                  <dd>
                    {evidenca.opravljeneUre?.toLocaleString('sl-SI', {
                      maximumFractionDigits: 20,
                    }) ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt>Opis izvedbe</dt>
                  <dd>{evidenca.opisIzvedbe || '—'}</dd>
                </div>
              </dl>

              {(jeOddano ||
                nalog.status === StatusDelovnegaNaloga.CakaNaPregled) && (
                <p className="evidenca-dela__notice">
                  Evidenca čaka na pregled organizatorja. Urejanje je zaklenjeno.
                </p>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}