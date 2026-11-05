import type { FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { InputField } from '../../../components/ui/InputField'
import { SelectField } from '../../../components/ui/SelectField'
import { TextareaField } from '../../../components/ui/TextareaField'
import type { NarociloFormErrors, NarociloFormValues } from '../models/narociloForm'
import type { VrstaStoritve } from '../models/vrstaStoritve'
import './NarociloForm.css'

interface NarociloFormProps {
  storitve: VrstaStoritve[]
  values: NarociloFormValues
  errors: NarociloFormErrors
  submitError: string | null
  isSubmitting: boolean
  onFieldChange: (field: keyof NarociloFormValues, value: string) => void
  onSubmit: () => Promise<void>
}

export function NarociloForm({
  storitve,
  values,
  errors,
  submitError,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: NarociloFormProps) {
  const casovniPas = Intl.DateTimeFormat().resolvedOptions().timeZone
  const disabled = isSubmitting || storitve.length === 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void onSubmit()
  }

  return (
    <form className="narocilo-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="narocilo-fields" disabled={disabled}>
        <legend className="narocilo-legend">Podatki naročila</legend>
        <SelectField
          label="Vrsta storitve"
          name="vrstaStoritveId"
          value={values.vrstaStoritveId}
          error={errors.vrstaStoritveId}
          onChange={event => onFieldChange('vrstaStoritveId', event.target.value)}
          required
        >
          <option value="">Izberite storitev</option>
          {storitve.map(storitev => (
            <option key={storitev.id} value={storitev.id}>
              {storitev.naziv}
            </option>
          ))}
        </SelectField>
        <InputField
          label="Lokacija"
          name="lokacija"
          autoComplete="street-address"
          value={values.lokacija}
          error={errors.lokacija}
          onChange={event => onFieldChange('lokacija', event.target.value)}
          required
        />
        <InputField
          label="Želeni datum in čas"
          name="zeleniTermin"
          type="datetime-local"
          step={60}
          hint={`Časovni pas: ${casovniPas}. Želeni termin je predlog; končnega določi organizator.`}
          value={values.zeleniTermin}
          error={errors.zeleniTermin}
          onChange={event => onFieldChange('zeleniTermin', event.target.value)}
          required
        />
        <TextareaField
          label="Opis dela"
          name="opisDela"
          hint="Opišite, kakšno delo potrebujete in kakšen je predvideni obseg."
          value={values.opisDela}
          error={errors.opisDela}
          onChange={event => onFieldChange('opisDela', event.target.value)}
          required
        />
      </fieldset>
      {submitError && (
        <p className="narocilo-submit-error" role="alert">{submitError}</p>
      )}
      <div className="narocilo-form-actions">
        <Button
          type="submit"
          disabled={disabled}
          loading={isSubmitting}
          loadingText="Oddajanje …"
        >
          Oddaj naročilo
        </Button>
        <p>Polja, označena z *, so obvezna.</p>
      </div>
    </form>
  )
}