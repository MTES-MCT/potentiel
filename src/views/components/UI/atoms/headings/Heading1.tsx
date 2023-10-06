import React, { ComponentProps } from 'react';

export const Heading1 = ({ children, className = '', ...props }: ComponentProps<'h1'>) => (
  <h1 {...props} className={`text-3xl leading-8 font-bold ${className}`}>
    {children}
  </h1>
);
