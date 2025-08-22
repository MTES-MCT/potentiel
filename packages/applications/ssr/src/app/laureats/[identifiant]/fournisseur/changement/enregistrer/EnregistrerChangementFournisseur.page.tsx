import type { FC } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Heading1 } from '@/components/atoms/headings';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import {
  EnregistrerChangementFournisseurForm,
  type EnregistrerChangementFournisseurFormProps,
} from './EnregistrerChangementFournisseur.form';

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
      <ProjetBanner identifiantProjet={IdentifiantProjet.bind(identifiantProjet).formatter()} />
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
