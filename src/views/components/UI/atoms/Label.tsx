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
        <span className="text-error-425-base">*</span>
      </>
    )}
  </label>
)
