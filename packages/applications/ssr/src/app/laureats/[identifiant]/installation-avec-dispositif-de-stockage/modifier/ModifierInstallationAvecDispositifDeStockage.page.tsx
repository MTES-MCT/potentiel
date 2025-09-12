import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  ModifierInstallationAvecDispositifDeStockageForm,
  ModifierInstallationAvecDispositifDeStockageFormProps,
} from './ModifierInstallationAvecDispositifDeStockage.form';

export type ModifierInstallationAvecDispositifDeStockagePageProps =
  ModifierInstallationAvecDispositifDeStockageFormProps;

export const ModifierInstallationAvecDispositifDeStockagePage: FC<
  ModifierInstallationAvecDispositifDeStockagePageProps
> = ({ identifiantProjet, installationAvecDispositifDeStockage }) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Changer le couplage de l'installation avec un dispositif de stockage</Heading1>
    <ModifierInstallationAvecDispositifDeStockageForm
      identifiantProjet={identifiantProjet}
      installationAvecDispositifDeStockage={installationAvecDispositifDeStockage}
    />
  </PageTemplate>
);
