import React, { ComponentProps } from 'react'

type LabelProps = ComponentProps<'label'> & {
  required?: true
}

export const Label = ({ required, children, ...props }: LabelProps) => (
  <label {...props}>
    {children}
    {required && (
      <>
        {' '}
        <span className="text-red-500">*</span>
      </>
    )}
  </label>
)
