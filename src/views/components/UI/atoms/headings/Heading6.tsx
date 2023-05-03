import React, { ComponentProps } from 'react';

export const Heading6 = ({ children, className = '', ...props }: ComponentProps<'h6'>) => (
  <h6 {...props} className={`text-base font-bold text-gray-900 ${className}`}>
    {children}
  </h6>
);
