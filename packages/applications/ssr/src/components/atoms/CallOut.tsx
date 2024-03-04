import { FC, ReactNode } from 'react';
import { FrIconClassName, RiIconClassName, fr } from '@codegouvfr/react-dsfr';

import { Heading3 } from './headings';

export type CallOutProps = {
  title?: string;
  iconId?: FrIconClassName | RiIconClassName;
  content: ReactNode;
};

/**
 * @description Ce composant est basé sur un design équivalent à celui du [react-dsfr](https://components.react-dsfr.codegouv.studio/?path=/docs/components-callout--default) mais permet l'utilisation de ReactNode pour le contenu
 */
export const CallOut: FC<CallOutProps> = ({ title, iconId, content }) => (
  <div className={`${fr.cx('fr-callout')} ${iconId ?? ''}`}>
    {title && <Heading3 className={fr.cx('fr-callout__title')}>{title}</Heading3>}
    <div className={fr.cx('fr-callout__text')}>{content}</div>
  </div>
);
