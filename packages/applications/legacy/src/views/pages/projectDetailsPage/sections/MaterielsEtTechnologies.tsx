import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { CogIcon, Section } from '../../../components';

type MaterielsEtTechnologiesProps = {
  fournisseur: ProjectDataForProjectPage['fournisseur'];
  evaluationCarbone: ProjectDataForProjectPage['evaluationCarbone'];
};

export const MaterielsEtTechnologies = ({
  fournisseur,
  evaluationCarbone,
}: MaterielsEtTechnologiesProps) => {
  if (!fournisseur && !evaluationCarbone) {
    return null;
  }
  return (
    <Section title="Matériels et technologies" icon={<CogIcon />}>
      {fournisseur && <div>Fournisseur: {fournisseur}</div>}
      {evaluationCarbone && (
        <div>Evaluation carbone simplifiée: {evaluationCarbone} kg eq CO2/kWc</div>
      )}
    </Section>
  );
};
