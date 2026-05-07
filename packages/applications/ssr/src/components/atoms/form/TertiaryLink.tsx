import clsx from 'clsx';
import React from 'react';
import { Link } from '../LinkNoPrefetch';

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
