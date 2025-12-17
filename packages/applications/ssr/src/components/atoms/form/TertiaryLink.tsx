/* eslint-disable react/jsx-props-no-spreading */

import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

type Props = React.ComponentProps<typeof Link>;

export const TertiaryLink = ({ className, ...props }: Props) => (
  <Link
    className={clsx(
      'w-fit text-sm text-dsfr-text-title-blueFrance-default font-medium print:hidden',
      className,
    )}
    {...props}
  />
);
