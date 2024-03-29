import React, { ComponentProps } from 'react';

export const Heading2 = ({ children, className = '', ...props }: ComponentProps<'h2'>) => (
  <h2 {...props} className={`pb-1 text-[26px] leading-7 font-bold ${className}`}>
    {children}
  </h2>
);
