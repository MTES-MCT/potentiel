import { ConfirmationProp, demanderConfirmation } from '../../../helpers';
import React, { ComponentProps, FC } from 'react';

type LinkButtonProps = ComponentProps<'a'> & ConfirmationProp & { disabled?: true };

export const SecondaryLinkButton: FC<LinkButtonProps> = ({
  children,
  className = '',
  confirmation = undefined,
  disabled = undefined,
  ...props
}) => (
  <a
    className={` 
    no-underline inline-flex items-center px-6 py-2 font-medium shadow-sm border border-solid border-blue-france-sun-base bg-white text-base text-blue-france-sun-base
     hover:text-blue-france-sun-base hover:bg-blue-france-975-base outline-offset-4 outline-2 outline-solid outline-outline-base focus:text-blue-france-sun-base focus:bg-blue-france-975-base active:text-blue-france-sun-base 
    ${disabled ? 'pointer-events-none !text-gray-400 !border-gray-400' : ''} ${className}`}
    style={{ color: '#000091' }}
    onClick={confirmation ? (event) => demanderConfirmation(event, confirmation) : undefined}
    aria-disabled={disabled}
    {...props}
  >
    {children}
  </a>
);
