import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  EnregistrerChangementFournisseurForm,
  EnregistrerChangementFournisseurFormProps,
} from './componentes/MettreAJourFournisseur.form';

export type EnregistrerChangementFournisseurPageProps = EnregistrerChangementFournisseurFormProps;
export const EnregistrerChangementFournisseurPage: FC<
  EnregistrerChangementFournisseurPageProps
> = ({
  identifiantProjet,
  fournisseurs,
  évaluationCarboneSimplifiée,
  technologie,
  évaluationCarboneSimplifiéeInitiale,
}) => (
  <PageTemplate
    banner={
      <ProjetLauréatBanner
        identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
    }
  >
    <Heading1>Changer de fournisseurs</Heading1>
    <EnregistrerChangementFournisseurForm
      identifiantProjet={identifiantProjet}
      fournisseurs={fournisseurs}
      évaluationCarboneSimplifiée={évaluationCarboneSimplifiée}
      technologie={technologie}
      évaluationCarboneSimplifiéeInitiale={évaluationCarboneSimplifiéeInitiale}
    />
  </PageTemplate>
);
