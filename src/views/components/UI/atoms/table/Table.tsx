import React, { ComponentProps } from 'react';

export type TableProps = ComponentProps<'table'>;

export const Table = ({ children, className = '', ...props }: TableProps) => {
  return (
    <table
      {...props}
      className={`bg-white border border-solid border-x-0 border-slate-200 rounded-sm relative w-full border-collapse ${className}`}
    >
      {children}
    </table>
  );
};
