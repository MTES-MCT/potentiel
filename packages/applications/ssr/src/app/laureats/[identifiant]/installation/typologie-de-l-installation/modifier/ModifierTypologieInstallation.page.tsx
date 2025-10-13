import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  ModifierTypologieInstallationForm,
  ModifierTypologieInstallationFormProps,
} from './ModifierTypologieInstallation.form';

export type ModifierTypologieInstallationPageProps = ModifierTypologieInstallationFormProps;

export const ModifierTypologieInstallationPage: FC<ModifierTypologieInstallationPageProps> = ({
  identifiantProjet,
  typologieInstallation,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Modifier la typologie du projet</Heading1>
    <ModifierTypologieInstallationForm
      identifiantProjet={identifiantProjet}
      typologieInstallation={typologieInstallation}
    />
  </PageTemplate>
);
