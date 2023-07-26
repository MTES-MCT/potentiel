import React, { ComponentProps } from 'react';

type LabelProps = ComponentProps<'label'> & {
  htmlFor: string;
  required?: true;
  disabled?: boolean;
};

export const Label = ({
  required,
  children,
  disabled = false,
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
    {required && (
      <>
        {' '}
        <span className="text-error-425-base">*</span>
      </>
    )}
  </label>
);
