import { useId } from 'react'
import { InputField } from '../../../components/ui/InputField'
import { SelectField } from '../../../components/ui/SelectField'
import type { Stroj } from '../models/stroj'
import type { Izvajalec } from '../models/izvajalec'
import type { PripravaNalogaFormValues } from '../models/pripravaNalogaFormValues'
import type { PripravaNalogaFormErrors } from '../models/pripravaNalogaFormErrors'
import '../../../components/ui/Button.css'
import './PripravaNalogaForm.css'
import type { KonfliktZasedenosti } from '../models/konfliktZasedenosti'
import { KonfliktZasedenostiObvestilo } from './KonfliktZasedenostiObvestilo'

interface PripravaNalogaFormProps {
  values: PripravaNalogaFormValues
  errors: PripravaNalogaFormErrors
  stroji: Stroj[]
  izvajalci: Izvajalec[]
  isSubmitting: boolean
  submitError: string | null
  konflikt: KonfliktZasedenosti | null
  onFieldChange: (field: keyof PripravaNalogaFormValues, value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

function nazivIzvajalca(izvajalec: Izvajalec): string {
  const ime = `${izvajalec.ime} ${izvajalec.priimek}`.trim()

  if (ime && izvajalec.email) return `${ime} (${izvajalec.email})`

  return ime || izvajalec.email || `Izvajalec #${izvajalec.id}`
}

export function PripravaNalogaForm({
  values, errors, stroji, izvajalci, isSubmitting,
  submitError, konflikt, onFieldChange, onSubmit, onCancel,
}: PripravaNalogaFormProps) {
  const id = useId()
  const niMoznosti = stroji.length === 0 || izvajalci.length === 0

  return (
    <form
      className="priprava-naloga-form"
      noValidate
      aria-busy={isSubmitting}
      onSubmit={(event) => {
        event.preventDefault()
        if (!isSubmitting && !niMoznosti && !konflikt) onSubmit()
      }}
    >
      {konflikt && <KonfliktZasedenostiObvestilo konflikt={konflikt} />}
      {submitError && (
        <div className="priprava-naloga-form__error" role="alert">
          {submitError}
        </div>
      )}

      <fieldset disabled={isSubmitting} aria-label="Razpored izvedbe">
        <SelectField
          id={`${id}-stroj`}
          name="strojId"
          label="Stroj"
          value={values.strojId}
          error={errors.strojId}
          onChange={(event) => onFieldChange('strojId', event.target.value)}
          required
        >
          <option value="">Izberite stroj</option>
          {stroji.map(stroj => (
            <option key={stroj.id} value={stroj.id}>
              {stroj.oznaka} – {stroj.naziv}
            </option>
          ))}
        </SelectField>

        <SelectField
          id={`${id}-izvajalec`}
          name="izvajalecId"
          label="Izvajalec"
          value={values.izvajalecId}
          error={errors.izvajalecId}
          onChange={(event) => onFieldChange('izvajalecId', event.target.value)}
          required
        >
          <option value="">Izberite izvajalca</option>
          {izvajalci.map(izvajalec => (
            <option key={izvajalec.id} value={izvajalec.id}>
              {nazivIzvajalca(izvajalec)}
            </option>
          ))}
        </SelectField>

        <div className="priprava-naloga-form__termin">
          <InputField
            id={`${id}-zacetek`}
            name="predvideniZacetek"
            type="datetime-local"
            step={60}
            label="Predvideni začetek"
            value={values.predvideniZacetek}
            error={errors.predvideniZacetek}
            onChange={(event) => onFieldChange('predvideniZacetek', event.target.value)}
            required
          />

          <InputField
            id={`${id}-konec`}
            name="predvideniKonec"
            type="datetime-local"
            step={60}
            label="Predvideni konec"
            value={values.predvideniKonec}
            error={errors.predvideniKonec}
            onChange={(event) => onFieldChange('predvideniKonec', event.target.value)}
            required
          />
        </div>

        <p className="priprava-naloga-form__hint">
          Termina vnesite v časovnem pasu svoje naprave.
        </p>

        <div className="priprava-naloga-form__actions">
          <button
            type="submit"
            className="button button--primary"
            disabled={niMoznosti || konflikt !== null}
          >
            {isSubmitting ? 'Ustvarjanje …' : 'Ustvari delovni nalog'}
          </button>
          <button type="button" className="button button--secondary" onClick={onCancel}>
            Nazaj na naročilo
          </button>
        </div>
      </fieldset>
    </form>
  )
}