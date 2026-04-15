import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  EnregistrerChangementInstallateurForm,
  EnregistrerChangementInstallateurFormProps,
} from './EnregistrerChangementInstallateur.form';

type EnregistrerChangementInstallateurPageProps = EnregistrerChangementInstallateurFormProps;

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
