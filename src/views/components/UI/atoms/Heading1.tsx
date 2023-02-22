import React, { ComponentProps } from 'react';

export const Heading1 = ({ children, className = '', ...props }: ComponentProps<'h1'>) => (
  <h1 {...props} className={`text-3xl font-bold text-gray-900 ${className}`}>
    {children}
  </h1>
);
