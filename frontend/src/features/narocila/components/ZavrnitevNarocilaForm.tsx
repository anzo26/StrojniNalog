import { useEffect, useId, useRef } from 'react'
import { TextareaField } from '../../../components/ui/TextareaField'

interface ZavrnitevNarocilaFormProps {
  razlog: string
  napaka: string | null
  obdelava: boolean
  onSprememba: (razlog: string) => void
  onOddaj: () => void
  onPreklic: () => void
}

export function ZavrnitevNarocilaForm({
  razlog, napaka, obdelava, onSprememba, onOddaj, onPreklic,
}: ZavrnitevNarocilaFormProps) {
  const razlogId = useId()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    formRef.current?.querySelector('textarea')?.focus()
  }, [])

  return (
    <form
      ref={formRef}
      className="zavrnitev-narocila-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        if (!obdelava) onOddaj()
      }}
    >
      <TextareaField
        id={razlogId}
        name="razlog"
        label="Razlog zavrnitve"
        hint="Naročniku pojasnite, zakaj naročila ni mogoče potrditi."
        value={razlog}
        error={napaka ?? undefined}
        onChange={(event) => onSprememba(event.target.value)}
        disabled={obdelava}
        required
      />

      <div className="obravnava-narocila__actions">
        <button type="submit" className="button button--danger" disabled={obdelava}>
          {obdelava ? 'Zavračanje …' : 'Potrdi zavrnitev'}
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={onPreklic}
          disabled={obdelava}
        >
          Prekliči
        </button>
      </div>
    </form>
  )
}