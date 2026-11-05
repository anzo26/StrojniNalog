import { Card } from '../../../components/ui/Card'
import { EmptyState } from '../../../components/ui/EmptyState'
import { LoadingState } from '../../../components/ui/LoadingState'
import { NarociloForm } from '../components/NarociloForm'
import { PotrditevOddaje } from '../components/PotrditevOddaje'
import { useAktivneStoritve } from '../hooks/useAktivneStoritve'
import { useOddajaNarocila } from '../hooks/useOddajaNarocila'
import './NovoNarociloPage.css'

export function NovoNarociloPage() {
  const { storitve, loading, error } = useAktivneStoritve()
  const oddaja = useOddajaNarocila()

  return (
    <div className="novo-narocilo-page">
      <div className="novo-narocilo-heading">
        <h1>Novo naročilo</h1>
        <p>Izberite storitev ter opišite delo, lokacijo in želeni termin.</p>
      </div>
      {oddaja.result ? (
        <PotrditevOddaje
          narocilo={oddaja.result}
          onNovoNarocilo={oddaja.reset}
        />
      ) : loading ? (
        <Card>
          <LoadingState message="Nalaganje storitev …" />
        </Card>
      ) : error ? (
        <Card>
          <div role="alert">
            <h2>Storitve niso na voljo</h2>
            <p>{error}</p>
          </div>
        </Card>
      ) : storitve.length === 0 ? (
        <Card>
          <EmptyState
            title="Trenutno ni aktivnih storitev"
            description="Oddaja naročila trenutno ni mogoča. Poskusite pozneje."
          />
        </Card>
      ) : (
        <Card>
          <NarociloForm
            storitve={storitve}
            values={oddaja.values}
            errors={oddaja.errors}
            submitError={oddaja.submitError}
            isSubmitting={oddaja.isSubmitting}
            onFieldChange={oddaja.setField}
            onSubmit={oddaja.submit}
          />
        </Card>
      )}
    </div>
  )
}