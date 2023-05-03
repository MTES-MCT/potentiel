import React, { ComponentProps } from 'react';

export const Heading5 = ({ children, className = '', ...props }: ComponentProps<'h5'>) => (
  <h5 {...props} className={`text-lg font-bold text-gray-900 ${className}`}>
    {children}
  </h5>
);
