import React, { ComponentProps } from 'react';

export type CalloutProps = ComponentProps<'div'>;

export const Callout = ({ children, className = '', ...props }: CalloutProps) => {
  return (
    <div
      {...props}
      className={`px-12 py-8 border-solid border-0 border-l-4 border-brown-caramel-main-648-base
       bg-brown-caramel-950-base ${className}`}
    >
      {children}
    </div>
  );
};
