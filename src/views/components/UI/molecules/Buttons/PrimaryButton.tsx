import { ConfirmationProp } from '@views/helpers';
import React, { ComponentProps, FC } from 'react';
import { Button } from '../../atoms/Button';

export type PrimaryButtonProps = ComponentProps<'button'> & ConfirmationProp;

export const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  className = '',
  confirmation = undefined,
  ...props
}) => (
  <Button
    className={`disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-grey-625-base cursor-pointer
                border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active text-white mr-auto
                ${className}`}
    confirmation={confirmation}
    {...props}
  >
    {children}
  </Button>
);
