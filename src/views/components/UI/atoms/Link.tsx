import { ConfirmationProp, demanderConfirmation } from '../../../helpers';
import React, { ComponentProps, FC } from 'react';

type LinkProps = ComponentProps<'a'> & ConfirmationProp;

export const Link: FC<LinkProps> = ({
  className = '',
  children,
  confirmation = undefined,
  ...props
}) => (
  <a
    className={`text-blue-france-sun-base underline hover:text-blue-france-sun-base hover:underline focus:text-blue-france-sun-base focus:underline outline-offset-4 outline-2 outline-solid outline-outline-base 
                ${className}`}
    onClick={confirmation ? (event) => demanderConfirmation(event, confirmation) : undefined}
    style={{ color: '#000091' }} // Style permettant de surcharger les styles css legacy appliqué sur l'élément a
    {...props}
  >
    {children}
  </a>
);
