import React from 'react'
import { Section } from '../components'
import { ProjectDataForProjectPage } from '@modules/project'

type MaterielsEtTechnologiesProps = {
  project: ProjectDataForProjectPage
}

export const MaterielsEtTechnologies = ({ project }: MaterielsEtTechnologiesProps) => (
  <Section title="Matériels et technologies" icon="cog">
    <div>Fournisseur: {project.fournisseur}</div>
    <div>Evaluation carbone simplifiée: {project.evaluationCarbone} kg eq CO2/kWc</div>
  </Section>
)
