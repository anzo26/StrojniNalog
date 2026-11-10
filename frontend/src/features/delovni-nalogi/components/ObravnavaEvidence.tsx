import { TextareaField } from '../../../components/ui/TextareaField'
import { useObravnavaEvidence } from '../hooks/useObravnavaEvidence'
import '../../../components/ui/Button.css'
import './ObravnavaEvidence.css'

interface ObravnavaEvidenceProps {
  id: number
  onUspeh: (sporocilo: string) => void
}

export function ObravnavaEvidence({
  id,
  onUspeh,
}: ObravnavaEvidenceProps) {
  const {
    razlog,
    napakaRazloga,
    napaka,
    dejanje,
    zakljuceno,
    spremeniRazlog,
    potrdi,
    vrni,
  } = useObravnavaEvidence(id)

  const posiljanje = dejanje !== null

  async function obPotrditvi() {
    if (await potrdi()) {
      onUspeh('Evidenca je potrjena. Delovni nalog je zaključen.')
    }
  }

  async function obVrnitvi() {
    if (await vrni()) {
      onUspeh('Evidenca je vrnjena izvajalcu v dopolnitev.')
    }
  }

  if (zakljuceno) {
    return <p role="status">Obravnava je uspela. Osveževanje naloga …</p>
  }

  return (
    <section
      className="obravnava-evidence"
      aria-labelledby="obravnava-evidence-title"
    >
      <h2 id="obravnava-evidence-title">Pregled evidence</h2>

      <p className="obravnava-evidence__description">
        Preverite dejanske čase, opravljene ure in opis izvedbe.
        Evidenco lahko potrdite ali vrnete izvajalcu v dopolnitev.
      </p>

      <form
        noValidate
        aria-busy={posiljanje}
        onSubmit={event => {
          event.preventDefault()
          void obVrnitvi()
        }}
      >
        <fieldset disabled={posiljanje}>
          <legend className="obravnava-evidence__legend">
            Odločitev o evidenci
          </legend>

          <TextareaField
            id="razlog-dopolnitve"
            label="Razlog dopolnitve"
            hint="Obvezno samo pri vrnitvi evidence v dopolnitev."
            rows={4}
            value={razlog}
            error={napakaRazloga ?? undefined}
            onChange={event => spremeniRazlog(event.target.value)}
          />

          {napaka && (
            <div className="obravnava-evidence__error" role="alert">
              {napaka}
            </div>
          )}

          <div className="obravnava-evidence__actions">
            <button
              type="button"
              className="button button--primary"
              onClick={() => void obPotrditvi()}
            >
              {dejanje === 'potrdi'
                ? 'Potrjevanje …'
                : 'Potrdi in zaključi'}
            </button>

            <button
              type="submit"
              className="button button--secondary"
            >
              {dejanje === 'vrni'
                ? 'Vračanje …'
                : 'Vrni v dopolnitev'}
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  )
}