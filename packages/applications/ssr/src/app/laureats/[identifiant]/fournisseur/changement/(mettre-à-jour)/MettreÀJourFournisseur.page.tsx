import { FC } from 'react';

import { Heading1 } from '@/components/atoms/headings';

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
  isInformationEnregistrée,
}) => (
  <>
    <Heading1>Changer de fournisseurs</Heading1>
    <MettreÀJourFournisseurForm
      identifiantProjet={identifiantProjet}
      fournisseurs={fournisseurs}
      évaluationCarboneSimplifiée={évaluationCarboneSimplifiée}
      technologie={technologie}
      évaluationCarboneSimplifiéeInitiale={évaluationCarboneSimplifiéeInitiale}
      isInformationEnregistrée={isInformationEnregistrée}
    />
  </>
);
