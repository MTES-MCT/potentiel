import React from 'react'
import { makeProjectIdentifier, User } from '../../../../entities'
import { ProjectDataForProjectPage } from '../../../../modules/project/dtos'
import { adminActions, porteurProjetActions } from '../../../components/actions'
import ProjectActions from '../../../components/projectActions'

interface ProjectHeaderProps {
  project: ProjectDataForProjectPage
  user: User
}

export const ProjectHeader = ({ project, user }: ProjectHeaderProps) => (
  <div
    className="panel__header"
    style={{
      position: 'relative',
      padding: '1.5em',
      paddingBottom: 0,
      backgroundColor:
        project.notifiedOn && project.isClasse ? '#daf5e7' : 'hsla(5,70%,79%,.45882)',
    }}
  >
    <h3>{project.nomProjet}</h3>
    <span style={{ marginLeft: 10 }}>
      {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
    </span>
    <div style={{ fontSize: 13 }}>{makeProjectIdentifier(project)}</div>
    <div
      style={{
        fontWeight: 'bold',
        color: project.notifiedOn && project.isClasse ? 'rgb(56, 118, 29)' : 'rgb(204, 0, 0)',
      }}
    >
      {project.notifiedOn && project.isClasse ? 'Actif' : 'Eliminé'}
    </div>
    <div style={{ position: 'absolute', right: '1.5em', bottom: 25 }}>
      <ProjectActions
        project={project}
        projectActions={
          user.role === 'porteur-projet'
            ? porteurProjetActions
            : user.role === 'admin'
            ? adminActions
            : undefined
        }
      />
    </div>
  </div>
)
