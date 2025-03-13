import { FrIconClassName, RiIconClassName } from '@codegouvfr/react-dsfr';
import Link from 'next/link';
import React, { FC } from 'react';

export type LinkActionProps = {
  label: string;
  href: string;
  iconId?: FrIconClassName | RiIconClassName;
};

export const LinkAction: FC<LinkActionProps> = ({
  label,
  href,
  iconId = 'fr-icon-arrow-right-line',
}) => (
  <Link href={href} className={`w-fit fr-link fr-link--icon-right ${iconId}`}>
    {label}
  </Link>
);
