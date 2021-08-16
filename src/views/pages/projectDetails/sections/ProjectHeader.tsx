import React from 'react'
import { User } from '../../../../entities'
import { ProjectDataForProjectPage } from '../../../../modules/project/dtos'
import ProjectActions from '../../../components/projectActions'

interface ProjectHeaderProps {
  project: ProjectDataForProjectPage
  user: User
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ProjectHeader = ({ project, user, cahiersChargesURLs }: ProjectHeaderProps) => (
  <div
    className="panel__header"
    style={{
      position: 'relative',
      padding: '1.5em',
      paddingBottom: 0,
      backgroundColor: project.isAbandoned
        ? '#fff0e4'
        : project.isClasse
        ? '#daf5e7'
        : 'hsla(5,70%,79%,.45882)',
    }}
  >
    <h3>{project.nomProjet}</h3>
    <span style={{ marginLeft: 10 }}>
      {project.communeProjet}, {project.departementProjet}, {project.regionProjet}
    </span>
    <div style={{ fontSize: 13 }}>
      {project.potentielIdentifier}{' '}
      {cahiersChargesURLs && (
        <>
          {'('}
          {cahiersChargesURLs.oldCahierChargesURL && (
            <a href={cahiersChargesURLs.oldCahierChargesURL}>ancien cahier des charges</a>
          )}

          {cahiersChargesURLs.newCahierChargesURL && (
            <>
              {' | '}
              <a href={cahiersChargesURLs.newCahierChargesURL}>nouveau cahier des charges</a>
            </>
          )}
          {')'}
        </>
      )}
    </div>
    <div style={{ fontSize: 13 }}>
      Instruction des demandes selon {project.newRulesOptIn ? 'les nouvelles' : 'les anciennes'}{' '}
      règles
    </div>

    <div
      style={{
        fontWeight: 'bold',
        color: project.isAbandoned
          ? '#ff9947'
          : project.isClasse
          ? 'rgb(56, 118, 29)'
          : 'rgb(204, 0, 0)',
      }}
    >
      {project.isAbandoned ? 'Abandonné' : project.isClasse ? 'Actif' : 'Eliminé'}
    </div>

    <div style={{ position: 'absolute', right: '1.5em', bottom: 25 }}>
      <ProjectActions project={project} role={user.role} />
    </div>
  </div>
)
