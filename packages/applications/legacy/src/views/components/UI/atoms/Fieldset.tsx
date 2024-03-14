import React, { ComponentProps } from 'react';

export type FieldsetProps = ComponentProps<'fieldset'>;

export const Fieldset = ({ children, className = '', ...props }: FieldsetProps) => {
  return (
    <fieldset {...props} className={`p-0 m-0 border-none w-full ${className}`}>
      {children}
    </fieldset>
  );
};
