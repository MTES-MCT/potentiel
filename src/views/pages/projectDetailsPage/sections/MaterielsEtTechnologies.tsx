import React from 'react'
import { Section } from '../components'
import { ProjectDataForProjectPage } from '@modules/project'
import { CogIcon } from '@components'

type MaterielsEtTechnologiesProps = {
  project: ProjectDataForProjectPage
}

export const MaterielsEtTechnologies = ({ project }: MaterielsEtTechnologiesProps) => {
  if (!project.fournisseur && !project.evaluationCarbone) {
    return null
  }
  return (
    <Section title="Matériels et technologies" Icon={CogIcon}>
      {project.fournisseur && <div>Fournisseur: {project.fournisseur}</div>}
      {project.evaluationCarbone && (
        <div>Evaluation carbone simplifiée: {project.evaluationCarbone} kg eq CO2/kWc</div>
      )}
    </Section>
  )
}
