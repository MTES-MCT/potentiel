import React, { ComponentProps } from 'react';

type FormProps = ComponentProps<'form'>;

export const Form = ({ children, className = '', ...props }: FormProps) => (
  <form {...props} className={`max-w-xl flex flex-col gap-4 ${className}`}>
    {children}
  </form>
);
