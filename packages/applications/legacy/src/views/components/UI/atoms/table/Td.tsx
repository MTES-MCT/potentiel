import React, { ComponentProps } from 'react';

type TdProps = ComponentProps<'td'>;

export const Td = ({ children, className = '', ...props }: TdProps) => (
  <td
    {...props}
    className={`p-4 text-left border border-x-0 border-solid border-slate-200 ${className}`}
  >
    {children}
  </td>
);
