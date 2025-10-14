import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  ModifierTypologieDuProjetForm,
  ModifierTypologieDuProjetFormProps,
} from './ModifierTypologieDuProjet.form';

export type ModifierTypologieDuProjetPageProps = ModifierTypologieDuProjetFormProps;

export const ModifierTypologieDuProjetPage: FC<ModifierTypologieDuProjetPageProps> = ({
  identifiantProjet,
  typologieDuProjet,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Modifier la typologie du projet</Heading1>
    <ModifierTypologieDuProjetForm
      identifiantProjet={identifiantProjet}
      typologieDuProjet={typologieDuProjet}
    />
  </PageTemplate>
);
