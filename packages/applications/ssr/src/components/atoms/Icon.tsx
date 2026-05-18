import { type FrIconClassName, fr, type RiIconClassName } from '@codegouvfr/react-dsfr';
import clsx from 'clsx';
import type { CSSProperties, FC } from 'react';

export type IconProps = {
  id: FrIconClassName | RiIconClassName;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  className?: string;
  style?: CSSProperties;
};

export const Icon: FC<IconProps> = ({ id, size = 'md', className, title, style }) => (
  <i
    className={clsx(`${fr.cx(id, `fr-icon--${size}`)}`, className)}
    title={title ?? undefined}
    aria-hidden={title ? undefined : true}
    style={style}
  />
);
