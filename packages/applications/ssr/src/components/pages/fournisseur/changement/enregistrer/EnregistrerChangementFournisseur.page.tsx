import { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { Heading1 } from '@/components/atoms/headings';
import { ColumnPageTemplate } from '@/components/templates/ColumnPage.template';

import {
  EnregistrerChangementFournisseurForm,
  EnregistrerChangementFournisseurFormProps,
} from './EnregistrerChangementFournisseur.form';

export type EnregistrerChangementFournisseurPageProps = EnregistrerChangementFournisseurFormProps;
export const EnregistrerChangementFournisseurPage: FC<
  EnregistrerChangementFournisseurPageProps
> = ({
  identifiantProjet,
  fournisseurs,
  évaluationCarboneSimplifiée,
  technologie,
  typesFournisseur,
  évaluationCarboneSimplifiéeInitiale,
}) => (
  <ColumnPageTemplate
    banner={
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
    }
    heading={<Heading1>Changer de fournisseurs</Heading1>}
    leftColumn={{
      children: (
        <EnregistrerChangementFournisseurForm
          identifiantProjet={identifiantProjet}
          fournisseurs={fournisseurs}
          évaluationCarboneSimplifiée={évaluationCarboneSimplifiée}
          technologie={technologie}
          évaluationCarboneSimplifiéeInitiale={évaluationCarboneSimplifiéeInitiale}
          typesFournisseur={typesFournisseur}
        />
      ),
    }}
    rightColumn={{
      children: <></>,
    }}
  />
);
