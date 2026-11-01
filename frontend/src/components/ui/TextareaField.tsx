import type { ComponentPropsWithoutRef } from 'react'
import { FormField } from './FormField'

interface TextareaFieldProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string
  hint?: string
  error?: string
}

export function TextareaField({
  id, label, hint, error, required, rows = 4, className = '',
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: TextareaFieldProps) {
  return (
    <FormField
      id={id} label={label} hint={hint} error={error}
      required={required} describedBy={describedBy} invalid={invalid}
    >
      {controlProps => (
        <textarea
          {...props}
          {...controlProps}
          required={required}
          rows={rows}
          className={`form-control ${className}`.trim()}
        />
      )}
    </FormField>
  )
}