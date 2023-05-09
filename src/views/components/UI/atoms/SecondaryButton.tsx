import { demanderConfirmation, ConfirmationProp } from '@views/helpers';
import React, { ComponentProps, FC, useRef } from 'react';

export type SecondaryButtonProps = Omit<ComponentProps<'button'>, 'disabled'> & ConfirmationProp;

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  children,
  className = '',
  confirmation = undefined,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      confirmation && demanderConfirmation(event, confirmation);
      buttonRef.current?.click();
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`inline-flex items-center px-6 py-2 border border-solid text-base text-decoration-none font-medium shadow-sm outline-offset-4 outline-2 outline-solid outline-outline-base
              border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base 
                ${className}`}
      onClick={confirmation ? (event) => demanderConfirmation(event, confirmation) : undefined}
      onKeyDown={(event) => handleKeyDown(event)}
      {...props}
    >
      {children}
    </button>
  );
};
