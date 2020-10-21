import React from 'react'
import { makeProjectIdentifier, Project, User } from '../../../../entities'
import ProjectActions from '../../../components/projectActions'
import { porteurProjetActions, adminActions } from '../../../components/actions'

interface ProjectHeaderProps {
  project: Project
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
        project.classe === 'Classé'
          ? '#daf5e7'
          : 'hsla(5,70%,79%,.45882)',
    }}
  >
    <h3>{project.nomProjet}</h3>
    <span style={{ marginLeft: 10 }}>
      {project.communeProjet}, {project.departementProjet},{' '}
      {project.regionProjet}
    </span>
    <div style={{ fontSize: 13 }}>{makeProjectIdentifier(project)}</div>
    <div
      style={{
        fontWeight: 'bold',
        color:
          project.classe === 'Classé'
            ? 'rgb(56, 118, 29)'
            : 'rgb(204, 0, 0)',
      }}
    >
      {project.classe === 'Classé' ? 'Actif' : 'Eliminé'}
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