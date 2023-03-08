import React, { ComponentProps, FC } from 'react';

export type SecondaryButtonProps = Omit<ComponentProps<'button'>, 'disabled'>;

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  children,
  className = '',
  ...props
}) => (
  <button
    className={`inline-flex items-center px-6 py-2 border border-solid text-base text-decoration-none font-medium shadow-sm outline-offset-4 outline-2 outline-solid outline-outline-base
              border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base 
                ${className}`}
    {...props}
  >
    {children}
  </button>
);
