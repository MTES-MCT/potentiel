import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierPuissanceForm, ModifierPuissanceFormProps } from './ModifierPuissance.form';

export type ModifierPuissancePageProps = ModifierPuissanceFormProps;

export const ModifierPuissancePage: FC<ModifierPuissancePageProps> = ({
  identifiantProjet,
  puissance,
  unitéPuissance,
  puissanceDeSite,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Changer la puissance</Heading1>
    <ModifierPuissanceForm
      identifiantProjet={identifiantProjet}
      puissance={puissance}
      unitéPuissance={unitéPuissance}
      puissanceDeSite={puissanceDeSite}
    />
  </PageTemplate>
);
