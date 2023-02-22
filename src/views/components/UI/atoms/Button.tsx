import React, { ComponentProps, FC } from 'react';

export type ButtonProps = ComponentProps<'button'>;

export const Button: FC<ButtonProps> = ({ children, className = '', ...props }) => (
  <button
    className={`disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-grey-625-base inline-flex items-center cursor-pointer px-6 py-2 border border-solid text-base text-decoration-none shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active text-white
                ${className}`}
    {...props}
  >
    {children}
  </button>
);
