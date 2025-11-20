import { FC } from 'react';

import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Heading1 } from '@/components/atoms/headings';

import { EnregistrerChangementInstallateurForm } from './EnregistrerChangementInstallateur.form';

export type EnregistrerChangementInstallateurPageProps =
  PlainType<Lauréat.Installation.ConsulterInstallateurReadModel>;

export const EnregistrerChangementInstallateurPage: FC<
  EnregistrerChangementInstallateurPageProps
> = ({ identifiantProjet, installateur }) => (
  <>
    <Heading1>Changer l'installateur</Heading1>
    <EnregistrerChangementInstallateurForm
      identifiantProjet={identifiantProjet}
      installateur={installateur}
    />
  </>
);
