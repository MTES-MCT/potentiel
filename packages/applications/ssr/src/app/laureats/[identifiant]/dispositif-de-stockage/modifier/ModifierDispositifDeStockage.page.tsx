import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  ModifierDispositifDeStockageForm,
  ModifierDispositifDeStockageFormProps,
} from './ModifierDispositifDeStockage.form';

export type ModifierDispositifDeStockagePageProps = ModifierDispositifDeStockageFormProps;

export const ModifierDispositifDeStockagePage: FC<ModifierDispositifDeStockagePageProps> = ({
  identifiantProjet,
  dispositifDeStockage,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Changer le dispositif de stockage</Heading1>
    <ModifierDispositifDeStockageForm
      identifiantProjet={identifiantProjet}
      dispositifDeStockage={dispositifDeStockage}
    />
  </PageTemplate>
);
