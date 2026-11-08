import { useNavigate } from 'react-router'
import { useMoznostiPripraveNaloga } from '../hooks/useMoznostiPripraveNaloga'
import { usePripravaNaloga } from '../hooks/usePripravaNaloga'
import { PripravaNalogaForm } from './PripravaNalogaForm'
import { DelovniNalogStatus } from './DelovniNalogStatus'

interface PripravaNalogaVsebinaProps {
  narociloId: number
}

export function PripravaNalogaVsebina({ narociloId }: PripravaNalogaVsebinaProps) {
  const navigate = useNavigate()
  const moznosti = useMoznostiPripraveNaloga()
  const priprava = usePripravaNaloga(narociloId)

  function nazajNaNarocilo() {
    navigate(`/narocila/${narociloId}`)
  }

  if (priprava.result) {
    return (
      <section className="priprava-naloga__panel">
        <h2>Delovni nalog #{priprava.result.id}</h2>
        <p role="status">Delovni nalog je bil uspešno ustvarjen.</p>
        <DelovniNalogStatus status={priprava.result.status} />
        <button type="button" className="button button--secondary" onClick={nazajNaNarocilo}>
          Nazaj na naročilo
        </button>
      </section>
    )
  }

  return (
    <section className="priprava-naloga__panel">
      <h2>Razpored izvedbe</h2>

      {moznosti.nalaganje && <p role="status">Nalaganje strojev in izvajalcev …</p>}

      {!moznosti.nalaganje && moznosti.napaka && (
        <div className="priprava-naloga__message" role="alert">
          <p>{moznosti.napaka}</p>
          <button type="button" className="button button--secondary" onClick={moznosti.osvezi}>
            Poskusi ponovno
          </button>
        </div>
      )}

      {!moznosti.nalaganje && !moznosti.napaka && (
        <>
          {moznosti.stroji.length === 0 && (
            <p role="status">Trenutno ni razpoložljivih strojev.</p>
          )}
          {moznosti.izvajalci.length === 0 && (
            <p role="status">Trenutno ni aktivnih izvajalcev za izbiro.</p>
          )}

          <PripravaNalogaForm
            values={priprava.values}
            errors={priprava.errors}
            stroji={moznosti.stroji}
            izvajalci={moznosti.izvajalci}
            isSubmitting={priprava.isSubmitting}
            submitError={priprava.submitError}
            onFieldChange={priprava.setField}
            onSubmit={() => void priprava.submit()}
            onCancel={nazajNaNarocilo}
          />
        </>
      )}
    </section>
  )
}