import { ConfirmationProp, demanderConfirmation } from '@views/helpers';
import React, { ComponentProps, FC } from 'react';

export type ButtonProps = ComponentProps<'button'> & ConfirmationProp;

export const Button: FC<ButtonProps> = ({
  children,
  className = '',
  confirmation = undefined,
  ...props
}) => (
  <button
    className={`disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-grey-625-base inline-flex items-center cursor-pointer px-6 py-2 border border-solid text-base text-decoration-none shadow-sm outline-offset-4 outline-2 outline-solid outline-outline-base
                border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active text-white
                ${className}`}
    onClick={confirmation ? (event) => demanderConfirmation(event, confirmation) : undefined}
    {...props}
  >
    {children}
  </button>
);
