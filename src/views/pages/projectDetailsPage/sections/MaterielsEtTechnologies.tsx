import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project';
import { CogIcon, Section } from '../../../components';

type MaterielsEtTechnologiesProps = {
  project: ProjectDataForProjectPage;
};

export const MaterielsEtTechnologies = ({ project }: MaterielsEtTechnologiesProps) => {
  if (!project.fournisseur && !project.evaluationCarbone) {
    return null;
  }
  return (
    <Section title="Matériels et technologies" icon={<CogIcon />}>
      {project.fournisseur && <div>Fournisseur: {project.fournisseur}</div>}
      {project.evaluationCarbone && (
        <div>Evaluation carbone simplifiée: {project.evaluationCarbone} kg eq CO2/kWc</div>
      )}
    </Section>
  );
};
