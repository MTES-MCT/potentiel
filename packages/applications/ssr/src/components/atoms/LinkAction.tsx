import { FrIconClassName, RiIconClassName } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';
import React, { FC } from 'react';

import { Link } from './LinkNoPrefetch';

export type LinkActionProps = {
  label: string;
  href: string;
  iconId?: FrIconClassName | RiIconClassName;
};

export const LinkAction: FC<LinkActionProps> = ({ label, href, iconId }) => (
  <Link href={href} className={clsx(`w-fit fr-link fr-link--icon-right ${iconId}`)}>
    {label}
  </Link>
);
