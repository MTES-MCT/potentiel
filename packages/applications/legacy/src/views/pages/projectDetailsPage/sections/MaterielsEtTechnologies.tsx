import React from 'react';
import { CogIcon, Heading3, Link, Section } from '../../../components';
import { ListeFournisseurs } from './ListeFournisseurs';
import { GetFournisseurForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getFournisseur';

export type MaterielsEtTechnologiesProps = {
  fournisseur?: GetFournisseurForProjectPage;
  modificationsNonPermisesParLeCDCActuel: boolean;
};

export const MaterielsEtTechnologies = ({
  fournisseur,
  modificationsNonPermisesParLeCDCActuel,
}: MaterielsEtTechnologiesProps) => {
  if (!fournisseur) {
    return null;
  }

  const { fournisseurs, évaluationCarboneSimplifiée, affichage } = fournisseur;

  return (
    <Section title="Matériels et technologies" icon={<CogIcon />}>
      <div>
        <Heading3 className="mb-1">Evaluation carbone simplifiée</Heading3>
        {évaluationCarboneSimplifiée} kg eq CO2/kWc
      </div>
      {fournisseurs.length > 0 && (
        <div className="mt-2">
          <Heading3 className="mb-1">Fournisseurs</Heading3>
          <ListeFournisseurs fournisseurs={fournisseurs} />
        </div>
      )}
      {affichage && !modificationsNonPermisesParLeCDCActuel && (
        <Link href={affichage.url} aria-label={affichage.label}>
          {affichage.label}
        </Link>
      )}
    </Section>
  );
};
