import { Link } from 'react-router'
import { useAuth } from '../../../hooks/useAuth'
import { useNarocilo } from '../hooks/useNarocilo'
import { NarociloPodatki } from './NarociloPodatki'
import { NarociloStatus } from './NarociloStatus'
import '../../../components/ui/Button.css'
import './NarociloPodrobnostiVsebina.css'
import { useState } from 'react'
import { ObravnavaNarocila } from './ObravnavaNarocila'
import { StatusNarocila } from '../../../models/enums/StatusNarocila'

interface NarociloPodrobnostiVsebinaProps {
    id: number
}

export function NarociloPodrobnostiVsebina({ id }: NarociloPodrobnostiVsebinaProps) {
    const { user } = useAuth()
    const { narocilo, nalaganje, napaka, osvezi } = useNarocilo(id)
    const jeOrganizator = user?.roles.includes('organizator') ?? false
    const [obvestilo, setObvestilo] = useState<string | null>(null)

    function obUspehu(sporocilo: string) {
        setObvestilo(sporocilo)
        osvezi()
    }


    return (
        <div className="narocilo-podrobnosti">
            <Link to="/narocila" className="button button--secondary narocilo-podrobnosti__back">
                Nazaj na naročila
            </Link>

            <div className="narocilo-podrobnosti__heading">
                <h1>Naročilo #{id}</h1>
                {narocilo && <NarociloStatus status={narocilo.status} />}
            </div>
            {obvestilo && (
                <div className="narocilo-podrobnosti__success" role="status">
                    {obvestilo}
                </div>
            )}
            <section className="narocilo-podrobnosti__panel" aria-label="Podatki naročila">
                {nalaganje && <p role="status">Nalaganje podrobnosti …</p>}

                {!nalaganje && napaka && (
                    <div className="narocilo-podrobnosti__error" role="alert">
                        <p>{napaka}</p>
                        <button type="button" className="button button--secondary" onClick={osvezi}>
                            Poskusi ponovno
                        </button>
                    </div>
                )}

                {!nalaganje && !napaka && narocilo && (
                    <NarociloPodatki narocilo={narocilo} prikaziNarocnika={jeOrganizator} />
                )}
            </section>
            {!nalaganje && !napaka && jeOrganizator && narocilo?.status === StatusNarocila.Oddano && (
                <ObravnavaNarocila
                    id={narocilo.id}
                    onUspeh={obUspehu}
                    onOsvezi={osvezi}
                />
            )}
        </div>
    )
}