import { ConfirmationProp } from "../../../../helpers";
import React, { ComponentProps, FC } from 'react';
import { Button } from '../../atoms/Button';

export type SecondaryButtonProps = Omit<ComponentProps<'button'>, 'disabled'> & ConfirmationProp;

export const SecondaryButton: FC<SecondaryButtonProps> = ({
  children,
  className = '',
  confirmation = undefined,
  ...props
}) => (
  <Button
    className={`font-medium border-blue-france-sun-base text-blue-france-sun-base bg-white hover:bg-blue-france-975-base focus:bg-blue-france-975-base 
                ${className}`}
    confirmation={confirmation}
    {...props}
  >
    {children}
  </Button>
);
