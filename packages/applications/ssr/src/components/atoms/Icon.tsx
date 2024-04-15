import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { CSSProperties, FC } from 'react';

export type IconProps = {
  id: FrIconClassName | RiIconClassName;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  className?: string;
  style?: CSSProperties;
};

export const Icon: FC<IconProps> = ({ id, size = 'md', className, title, style }) => (
  <i
    className={`${fr.cx(id, `fr-icon--${size}`)} ${className ?? ''}`}
    {...(title ? { title } : { 'aria-hidden': true })}
    style={style ?? undefined}
  />
);
