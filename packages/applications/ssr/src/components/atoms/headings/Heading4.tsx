import React, { ComponentProps } from 'react';

export const Heading4 = ({ children, className = '', ...props }: ComponentProps<'h4'>) => (
  <h4 {...props} className={`text-xl font-bold ${className}`}>
    {children}
  </h4>
);
