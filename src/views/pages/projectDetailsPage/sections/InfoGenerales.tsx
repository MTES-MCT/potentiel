import React from 'react'
import { ProjectDataForProjectPage } from '@modules/project'
import { Section } from '../components'
import { Heading3 } from '@views/components'

type InfoGeneralesProps = {
  project: ProjectDataForProjectPage
}

export const InfoGenerales = ({ project }: InfoGeneralesProps) => (
  <Section title="Projet" icon="building">
    <div>
      <Heading3 style={{ marginBottom: 5 }}>Performances</Heading3>
      <div>
        Puissance installée: {project.puissance} {project.appelOffre?.unitePuissance}
      </div>
    </div>
    <div>
      <Heading3 style={{ marginBottom: 5, marginTop: 10 }}>Site de production</Heading3>
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
