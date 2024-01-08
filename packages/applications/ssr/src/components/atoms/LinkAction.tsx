import React, { FC } from 'react';
import Link from 'next/link';
import { Route } from 'next';

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
    href={href as Route}
    {...(key && { key })}
    className={`w-fit fr-link fr-icon-arrow-right-line fr-link--icon-right ${className}`}
  >
    {label}
  </Link>
);
