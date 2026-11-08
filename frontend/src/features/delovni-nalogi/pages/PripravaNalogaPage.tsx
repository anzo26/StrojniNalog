import { Link, useParams } from 'react-router'
import { StatusNarocila } from '../../../models/enums/StatusNarocila'
import { NarociloPodatki } from '../../narocila/components/NarociloPodatki'
import { NarociloStatus } from '../../narocila/components/NarociloStatus'
import { useNarocilo } from '../../narocila/hooks/useNarocilo'
import { PripravaNalogaVsebina } from '../components/PripravaNalogaVsebina'
import '../../../components/ui/Button.css'
import './PripravaNalogaPage.css'

export function PripravaNalogaPage() {
    const { id } = useParams<{ id: string }>()
    const narociloId = Number(id)

    if (!id || !/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(narociloId)) {
        return (
            <div>
                <h1>Neveljavna številka naročila</h1>
                <Link to="/narocila">Nazaj na naročila</Link>
            </div>
        )
    }

    return <PripravaNalogaZaNarocilo key={narociloId} narociloId={narociloId} />
}

function PripravaNalogaZaNarocilo({ narociloId }: { narociloId: number }) {
    const { narocilo, nalaganje, napaka, osvezi } = useNarocilo(narociloId)

    if (nalaganje) return <p role="status">Nalaganje naročila …</p>

    if (napaka) {
        return (
            <div className="priprava-naloga__message" role="alert">
                <p>{napaka}</p>
                <button type="button" className="button button--secondary" onClick={osvezi}>
                    Poskusi ponovno
                </button>
                <Link to="/narocila">Nazaj na naročila</Link>
            </div>
        )
    }

    if (!narocilo) return null

    return (
        <div className="priprava-naloga-page">
            <Link
                to={`/narocila/${narociloId}`}
                className="button button--secondary priprava-naloga__back"
            >
                Nazaj na naročilo
            </Link>

            <header className="priprava-naloga__heading">
                <div>
                    <h1>Priprava delovnega naloga</h1>
                    <p>Naročilo #{narocilo.id}</p>
                </div>
                <NarociloStatus status={narocilo.status} />
            </header>

            {narocilo.delovniNalogId != null ? (
                <section className="priprava-naloga__panel">
                    <p>Za to naročilo je že pripravljen delovni nalog #{narocilo.delovniNalogId}.</p>
                    <Link
                        to={`/delovni-nalogi/${narocilo.delovniNalogId}`}
                        className="button button--primary"
                    >
                        Preglej delovni nalog
                    </Link>
                </section>
            ) : narocilo.status !== StatusNarocila.Potrjeno ? (
                <section className="priprava-naloga__panel">
                    <p>Delovni nalog lahko pripravite samo za potrjeno naročilo.</p>
                </section>
            ) : (
                <div className="priprava-naloga__layout">
                    <section className="priprava-naloga__panel priprava-naloga__povzetek">
                        <h2>Povzetek naročila</h2>
                        <NarociloPodatki narocilo={narocilo} prikaziNarocnika />
                    </section>
                    <PripravaNalogaVsebina narociloId={narocilo.id} />
                </div>
            )}
        </div>
    )
}