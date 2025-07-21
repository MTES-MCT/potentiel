import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierPuissanceForm, ModifierPuissanceFormProps } from './ModifierPuissance.form';

export type ModifierPuissancePageProps = ModifierPuissanceFormProps;

export const ModifierPuissancePage: FC<ModifierPuissancePageProps> = ({
  identifiantProjet,
  puissance,
  unitéPuissance,
}) => (
  <PageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
  >
    <Heading1>Changer la puissance</Heading1>
    <ModifierPuissanceForm
      identifiantProjet={identifiantProjet}
      puissance={puissance}
      unitéPuissance={unitéPuissance}
    />
  </PageTemplate>
);
