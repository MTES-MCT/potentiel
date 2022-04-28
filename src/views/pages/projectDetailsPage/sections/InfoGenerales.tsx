import React from 'react'
import { ProjectDataForProjectPage } from '@modules/project'
import { Section } from '../components'

type InfoGeneralesProps = {
  project: ProjectDataForProjectPage
}

export const InfoGenerales = ({ project }: InfoGeneralesProps) => (
  <Section title="Projet" icon="building">
    <div>
      <h5 style={{ marginBottom: 5 }}>Performances</h5>
      <div>
        Puissance installée: {project.puissance} {project.appelOffre?.unitePuissance}
      </div>
    </div>
    <div>
      <h5 style={{ marginBottom: 5, marginTop: 10 }}>Site de production</h5>
      <div>{project.adresseProjet}</div>
      <div>
        {project.codePostalProjet} {project.communeProjet}
      </div>
      <div>
        {project.departementProjet}, {project.regionProjet}
      </div>
    </div>
  </Section>
)
