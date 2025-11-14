import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

import {
  ModifierInstallateurForm,
  ModifierInstallateurFormProps,
} from './ModifierInstallateur.form';

export type ModifierInstallateurPageProps = ModifierInstallateurFormProps;

export const ModifierInstallateurPage: FC<ModifierInstallateurPageProps> = ({
  identifiantProjet,
  installateur,
}) => (
  <>
    <Heading1>Changer l'installateur</Heading1>
    <ModifierInstallateurForm identifiantProjet={identifiantProjet} installateur={installateur} />
  </>
);
