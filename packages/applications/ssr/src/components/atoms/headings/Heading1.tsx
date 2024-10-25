import React, { ComponentProps } from 'react';

export const Heading1 = ({ children, className = '', ...props }: ComponentProps<'h1'>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <h1 {...props} className={`my-5 text-3xl leading-8 font-bold ${className}`}>
    {children}
  </h1>
);
