import React from 'react'
import { Astérisque } from './Astérisque'

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean
}

export const Label = ({ required = false, children, ...props }: LabelProps) => (
  <label {...props}>
    {children}
    {required && (
      <>
        {' '}
        <Astérisque />
      </>
    )}
  </label>
)
