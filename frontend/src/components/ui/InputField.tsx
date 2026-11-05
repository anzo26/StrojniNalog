import type { ComponentPropsWithoutRef } from 'react'
import { FormField } from './FormField'

interface InputFieldProps extends ComponentPropsWithoutRef<'input'> {
  label: string
  hint?: string
  error?: string
}

export function InputField({
  id, label, hint, error, required, className = '',
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: InputFieldProps) {
  return (
    <FormField
      id={id} label={label} hint={hint} error={error}
      required={required} describedBy={describedBy} invalid={invalid}
    >
      {controlProps => (
        <input
          {...props}
          {...controlProps}
          required={required}
          className={`form-control ${className}`.trim()}
        />
      )}
    </FormField>
  )
}