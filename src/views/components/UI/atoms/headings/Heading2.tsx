import React, { ComponentProps } from 'react';

export const Heading2 = ({ children, className = '', ...props }: ComponentProps<'h2'>) => (
  <h2 {...props} className={`text-[28px] leading-5 font-bold text-gray-900 ${className}`}>
    {children}
  </h2>
);
