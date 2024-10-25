import React, { ComponentProps } from 'react';

export const Heading5 = ({ children, className = '', ...props }: ComponentProps<'h5'>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <h5 {...props} className={`text-lg font-bold ${className}`}>
    {children}
  </h5>
);
