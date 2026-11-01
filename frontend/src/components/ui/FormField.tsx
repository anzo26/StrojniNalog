import { useId } from 'react'
import type { AriaAttributes, ReactNode } from 'react'
import './FormField.css'

interface ControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: AriaAttributes['aria-invalid']
}

interface FormFieldProps {
  id?: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  describedBy?: string
  invalid?: AriaAttributes['aria-invalid']
  children: (controlProps: ControlProps) => ReactNode
}

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  describedBy,
  invalid,
  children,
}: FormFieldProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const hintId = hint ? `${controlId}-hint` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const descriptionIds = [describedBy, hintId, errorId].filter(Boolean).join(' ')

  return (
    <div className="form-field">
      <label className="form-label" htmlFor={controlId}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && <p id={hintId} className="form-hint">{hint}</p>}
      {children({
        id: controlId,
        'aria-describedby': descriptionIds || undefined,
        'aria-invalid': error ? true : invalid,
      })}
      {error && <p id={errorId} className="form-error" role="alert">{error}</p>}
    </div>
  )
}