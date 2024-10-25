import React, { ComponentProps } from 'react';

export const Heading3 = ({ children, className = '', ...props }: ComponentProps<'h3'>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <h3 {...props} className={`text-lg leading-6 font-bold ${className}`}>
    {children}
  </h3>
);
