import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';
import { FC, ReactNode } from 'react';
import clsx from 'clsx';

import { Heading3 } from './headings';

const getColorVariant = (colorVariant: CallOutProps['colorVariant']) => {
  switch (colorVariant) {
    case 'success':
      return 'fr-callout--green-emeraude';
    case 'error':
      return 'fr-callout--orange-terre-battue';
    case 'warning':
      return 'fr-callout--brown-caramel';
    case 'info':
      return undefined;
  }
};

const getIconId = (colorVariant: CallOutProps['colorVariant'], iconId: CallOutProps['iconId']) => {
  switch (colorVariant) {
    case 'success':
      return 'fr-icon-checkbox-circle-line';
    case 'error':
      return 'fr-icon-error-line';
    case 'warning':
      return 'fr-icon-warning-line';
    case 'info':
    default:
      return iconId ?? 'ri-information-line';
  }
};

export type CallOutProps = {
  content: ReactNode;
  title?: string;
  iconId?: FrIconClassName | RiIconClassName;
  colorVariant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
};

/**
 * @description Ce composant est basé sur un design équivalent à celui du [react-dsfr](https://components.react-dsfr.codegouv.studio/?path=/docs/components-callout--default) mais permet l'utilisation de ReactNode pour le contenu
 */
export const CallOut: FC<CallOutProps> = ({
  title,
  content,
  className,
  iconId = 'ri-information-line',
  colorVariant = 'info',
}) => (
  <div
    className={clsx(
      fr.cx('fr-callout', getColorVariant(colorVariant), getIconId(colorVariant, iconId)),
      className,
    )}
  >
    {title && <Heading3 className={fr.cx('fr-callout__title')}>{title}</Heading3>}
    <div className={fr.cx('fr-callout__text')}>{content}</div>
  </div>
);
