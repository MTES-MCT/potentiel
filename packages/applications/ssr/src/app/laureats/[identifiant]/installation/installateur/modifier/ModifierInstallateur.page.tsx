import type { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';
import {
  ModifierInstallateurForm,
  type ModifierInstallateurFormProps,
} from './ModifierInstallateur.form';

type ModifierInstallateurPageProps = ModifierInstallateurFormProps;

export const ModifierInstallateurPage: FC<ModifierInstallateurPageProps> = ({
  identifiantProjet,
  installateur,
}) => (
  <>
    <Heading1>Changer l'installateur</Heading1>
    <ModifierInstallateurForm identifiantProjet={identifiantProjet} installateur={installateur} />
  </>
);
