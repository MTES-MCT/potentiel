import React from 'react'
import { Section } from '../components'
import { ProjectDataForProjectPage } from '@modules/project'

type MaterielsEtTechnologiesProps = {
  project: ProjectDataForProjectPage
}

export const MaterielsEtTechnologies = ({ project }: MaterielsEtTechnologiesProps) => {
  if (!project.fournisseur && !project.evaluationCarbone) {
    return null
  }
  return (
    <Section title="Matériels et technologies" icon="cog">
      {project.fournisseur && <div>Fournisseur: {project.fournisseur}</div>}
      {project.evaluationCarbone && (
        <div>Evaluation carbone simplifiée: {project.evaluationCarbone} kg eq CO2/kWc</div>
      )}
    </Section>
  )
}
