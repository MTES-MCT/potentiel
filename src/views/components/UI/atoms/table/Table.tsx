import React, { ComponentProps } from 'react';

type TdProps = ComponentProps<'table'>;

export const Table = ({ children, className = '', ...props }: TdProps) => (
  <table
    {...props}
    className={`p-4 text-left border-collapse border border-solid border-slate-200 w-full rounded-sm ${className}`}
  >
    {children}
  </table>
);
