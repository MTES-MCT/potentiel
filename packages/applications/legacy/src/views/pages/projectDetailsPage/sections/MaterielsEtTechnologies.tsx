import React from 'react';
import { CogIcon, Heading3, Link, Section } from '../../../components';
import { ListeFournisseurs } from './ListeFournisseurs';
import { GetFournisseurForProjectPage } from '../../../../controllers/project/getProjectPage/_utils/getFournisseur';

export type MaterielsEtTechnologiesProps = {
  fournisseur?: GetFournisseurForProjectPage;
};

export const MaterielsEtTechnologies = ({ fournisseur }: MaterielsEtTechnologiesProps) => {
  if (!fournisseur) {
    return null;
  }

  const { fournisseurs, évaluationCarboneSimplifiée, affichage } = fournisseur;

  return (
    <Section title="Matériels et technologies" icon={<CogIcon />} className="flex gap-4 flex-col">
      <div className="flex flex-col gap-0">
        <Heading3 className="m-0">Évaluation carbone simplifiée</Heading3>
        <span>{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
      </div>
      {fournisseurs.length > 0 && (
        <div className="flex flex-col gap-0">
          <Heading3 className="m-0">Fournisseurs</Heading3>
          <ListeFournisseurs fournisseurs={fournisseurs} />
          {affichage && (
            <Link href={affichage.url} aria-label={affichage.label}>
              {affichage.label}
            </Link>
          )}
        </div>
      )}
    </Section>
  );
};
