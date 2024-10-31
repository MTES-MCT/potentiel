import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';
import { FC } from 'react';

export type IconProps = {
  id: FrIconClassName | RiIconClassName;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  className?: string;
};

export const Icon: FC<IconProps> = ({ id, size = 'md', className, title }) => (
  <i
    className={clsx(`${fr.cx(id, `fr-icon--${size}`)}`, className)}
    title={title ?? undefined}
    aria-hidden={title ? undefined : true}
  />
);
