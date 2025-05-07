import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierProducteurForm, ModifierProducteurFormProps } from './ModifierProducteur.form';

export type ModifierProducteurPageProps = ModifierProducteurFormProps;

export const ModifierProducteurPage: FC<ModifierProducteurPageProps> = ({
  identifiantProjet,
  producteur,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Changer le producteur</Heading1>
    <ModifierProducteurForm identifiantProjet={identifiantProjet} producteur={producteur} />
  </PageTemplate>
);
