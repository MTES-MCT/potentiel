import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { Heading1 } from '@/components/atoms/headings';
import { PageTemplate } from '@/components/templates/Page.template';

import {
  MettreÀJourFournisseurForm,
  MettreÀJourFournisseurFormProps,
} from './component/MettreÀJourFournisseur.form';

export type MettreÀJourFournisseurPageProps = MettreÀJourFournisseurFormProps;
export const MettreÀJourFournisseurPage: FC<MettreÀJourFournisseurPageProps> = ({
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
    <MettreÀJourFournisseurForm
      identifiantProjet={identifiantProjet}
      fournisseurs={fournisseurs}
      évaluationCarboneSimplifiée={évaluationCarboneSimplifiée}
      technologie={technologie}
      évaluationCarboneSimplifiéeInitiale={évaluationCarboneSimplifiéeInitiale}
    />
  </PageTemplate>
);
