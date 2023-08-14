import { ConfirmationProp, demanderConfirmation } from "../../../helpers";
import React, { ComponentProps, FC, useRef } from 'react';

export type ButtonProps = ComponentProps<'button'> & ConfirmationProp;

export const Button: FC<ButtonProps> = ({
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
      className={`inline-flex items-center px-6 py-2 border border-solid text-base text-decoration-none shadow-sm outline-offset-4 outline-2 outline-solid outline-outline-base
                ${className}`}
      ref={buttonRef}
      onClick={(event) => confirmation && demanderConfirmation(event, confirmation)}
      onKeyDown={(event) => handleKeyDown(event)}
      {...props}
    >
      {children}
    </button>
  );
};
