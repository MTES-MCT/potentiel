import { FrIconClassName, fr } from '@codegouvfr/react-dsfr';
import { FC } from 'react';

type IconProps = {
  id: FrIconClassName;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  className?: string;
};

export const Icon: FC<IconProps> = ({ id, size = 'md', className, title }) => (
  <i
    className={`${fr.cx(id, `fr-icon--${size}`)} ${className ?? ''}`}
    {...(title ? { title } : { 'aria-hidden': true })}
  />
);
