import React, { ComponentProps } from 'react';

type TdProps = ComponentProps<'th'>;

export const Th = ({ children, className = '', ...props }: TdProps) => (
  <th {...props} className={`p-4 text-left text-sm font-bold uppercase border-none ${className}`}>
    {children}
  </th>
);
