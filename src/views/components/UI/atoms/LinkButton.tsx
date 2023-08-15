import { ConfirmationProp, demanderConfirmation } from "../../../helpers";
import React, { ComponentProps, FC } from 'react';

type LinkButtonProps = ComponentProps<'a'> & ConfirmationProp;

export const LinkButton: FC<LinkButtonProps> = ({
  children,
  className = '',
  confirmation = undefined,
  ...props
}) => (
  <a
    className={`text-white no-underline inline-flex items-center px-6 py-2 border border-solid text-base shadow-sm outline-offset-4 outline-2 outline-solid outline-outline-base border-transparent bg-blue-france-sun-base hover:bg-blue-france-sun-hover focus:bg-blue-france-sun-active
    ${className}`}
    style={{ color: '#ffffff', textDecoration: 'none' }} // Style permettant de surcharger les styles css legacy appliqué sur l'élément a
    onClick={confirmation ? (event) => demanderConfirmation(event, confirmation) : undefined}
    {...props}
  >
    {children}
  </a>
);
