import React, { ComponentProps } from 'react';

type LabelProps = ComponentProps<'label'> & {
  htmlFor: string;
  disabled?: true;
  optionnel?: true;
};

export const Label = ({
  optionnel,
  children,
  disabled,
  htmlFor,
  className = '',
  ...props
}: LabelProps) => (
  <label
    htmlFor={htmlFor}
    {...props}
    className={`${disabled && 'text-grey-625-base'} ${className}`}
  >
    {children}
    {optionnel && ' (optionnel)'}
  </label>
);
