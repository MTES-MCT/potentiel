import React, { ComponentProps } from 'react';

export const Heading6 = ({ children, className = '', ...props }: ComponentProps<'h6'>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <h6 {...props} className={`text-base font-bold ${className}`}>
    {children}
  </h6>
);
