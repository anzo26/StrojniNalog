import type { ComponentPropsWithoutRef } from 'react'
import { FormField } from './FormField'

interface SelectFieldProps extends ComponentPropsWithoutRef<'select'> {
  label: string
  hint?: string
  error?: string
}

export function SelectField({
  id, label, hint, error, required, children, className = '',
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: SelectFieldProps) {
  return (
    <FormField
      id={id} label={label} hint={hint} error={error}
      required={required} describedBy={describedBy} invalid={invalid}
    >
      {controlProps => (
        <select
          {...props}
          {...controlProps}
          required={required}
          className={`form-control ${className}`.trim()}
        >
          {children}
        </select>
      )}
    </FormField>
  )
}