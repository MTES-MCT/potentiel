import Link from 'next/link';
import React, { FC } from 'react';

type LinkActionProps = {
  label: string;
  href: string;
  key?: string;
  className?: string;
};

export const LinkAction: FC<LinkActionProps> = ({
  label,
  href,
  key = undefined,
  className = undefined,
}) => (
  <Link
    href={href}
    key={key ?? undefined}
    className={`w-fit fr-link fr-icon-arrow-right-line fr-link--icon-right ${className}`}
  >
    {label}
  </Link>
);
