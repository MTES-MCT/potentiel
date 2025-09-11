import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  ModifierInstallateurForm,
  ModifierInstallateurFormProps,
} from './ModifierInstallateur.form';

export type ModifierInstallateurPageProps = ModifierInstallateurFormProps;

export const ModifierInstallateurPage: FC<ModifierInstallateurPageProps> = ({
  identifiantProjet,
  installateur,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Changer l'installateur</Heading1>
    <ModifierInstallateurForm identifiantProjet={identifiantProjet} installateur={installateur} />
  </PageTemplate>
);
