import React, { ComponentProps } from 'react';

type LabelProps = ComponentProps<'label'> & {
  htmlFor: string;
  required?: true;
};

export const Label = ({ required, children, htmlFor, ...props }: LabelProps) => (
  <label htmlFor={htmlFor} {...props}>
    {children}
    {required && (
      <>
        {' '}
        <span className="text-error-425-base">*</span>
      </>
    )}
  </label>
);
