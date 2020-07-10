import React from 'react'

import { Project, AppelOffre, makeProjectIdentifier } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import { PaginatedList } from '../../types'

import ProjectActions from './projectActions'
import Pagination from './pagination'

type Columns =
  // | 'Periode'
  'Projet' | 'Candidat' | 'Puissance' | 'Prix' | 'Evaluation Carbone' | 'Classé'

type ColumnRenderer = (props: { project: Project }) => React.ReactNode

const ColumnComponent: Record<Columns, ColumnRenderer> = {
  // Periode: ({ project }) => (
  //   <td valign="top" className="projectList-periode-column">
  //     <div
  //       style={{
  //         fontStyle: 'italic',
  //         lineHeight: 'normal',
  //         fontSize: 12,
  //       }}
  //       {...dataId('projectList-item-periode')}
  //     >
  //       {project.appelOffreId} Période {project.periodeId}
  //     </div>
  //     <div
  //       style={{
  //         fontStyle: 'italic',
  //         lineHeight: 'normal',
  //         fontSize: 12,
  //       }}
  //       {...dataId('projectList-item-famille')}
  //     >
  //       {project.familleId?.length ? `famille ${project.familleId}` : ''}
  //     </div>
  //   </td>
  // ),
  Projet: ({ project }) => (
    <td valign="top" className="projectList-projet-column">
      <div {...dataId('projectList-item-nomProjet')}>{project.nomProjet}</div>
      <div
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
        }}
      >
        <span {...dataId('projectList-item-communeProjet')}>
          {project.communeProjet}
        </span>
        ,{' '}
        <span {...dataId('projectList-item-departementProjet')}>
          {project.departementProjet}
        </span>
        ,{' '}
        <span {...dataId('projectList-item-regionProjet')}>
          {project.regionProjet}
        </span>
        <div style={{ marginTop: 5, fontStyle: 'normal' }}>
          {makeProjectIdentifier(project)}
        </div>
      </div>
    </td>
  ),
  Candidat: ({ project }) => (
    <td valign="top" className="projectList-candidat-column">
      <div {...dataId('projectList-item-nomCandidat')}>
        {project.nomCandidat}
      </div>
      <div
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
        }}
      >
        <span {...dataId('projectList-item-nomRepresentantLegal')}>
          {project.nomRepresentantLegal}
        </span>{' '}
        <span {...dataId('projectList-item-email')}>{project.email}</span>
      </div>
    </td>
  ),
  Puissance: ({ project }) => (
    <td valign="top" className="projectList-puissance-column">
      <span {...dataId('projectList-item-puissance')}>{project.puissance}</span>{' '}
      <span
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
        }}
      >
        {project.appelOffre?.unitePuissance}
      </span>
    </td>
  ),
  Prix: ({ project }) => (
    <td valign="top" className="projectList-prix-column">
      <span {...dataId('projectList-item-prixReference')}>
        {project.prixReference}
      </span>{' '}
      <span
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
        }}
      >
        €/MWh
      </span>
    </td>
  ),
  'Evaluation Carbone': ({ project }) => (
    <td valign="top" className="projectList-evaluation-column">
      <span {...dataId('projectList-item-evaluationCarbone')}>
        {project.evaluationCarbone}
      </span>{' '}
      <span
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
        }}
      >
        kg eq CO2/kWc
      </span>
    </td>
  ),
  Classé: ({ project }) => (
    <td
      valign="top"
      className={
        'projectList-classe-column notification ' +
        (project.classe === 'Classé' ? 'success' : 'error')
      }
      style={{ position: 'relative' }}
    >
      <div {...dataId('projectList-item-classe')}>
        {project.classe === 'Classé' || !project.motifsElimination ? (
          project.classe
        ) : (
          <a
            href="#"
            {...dataId('projectList-item-toggleMotifsElimination')}
            style={{
              textDecoration: 'none',
              color: 'var(--theme-dark-text)',
              whiteSpace: 'nowrap',
            }}
          >
            Eliminé
            <svg
              className="icon icon-mail"
              style={{
                width: 10,
                verticalAlign: 'bottom',
                marginLeft: 5,
              }}
            >
              <use xlinkHref="#expand"></use>
            </svg>
          </a>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 5,
          fontSize: 12,
          color: 'var(--green)',
        }}
      >
        {project.classe === 'Classé'
          ? project.isFinancementParticipatif
            ? 'FP'
            : project.isInvestissementParticipatif
            ? 'IP'
            : ''
          : ''}
      </div>

      <div
        style={{
          fontStyle: 'italic',
          lineHeight: 'normal',
          fontSize: 12,
          display: 'none',
        }}
        className="motif-popover"
        {...dataId('projectList-item-motifsElimination')}
      >
        {project.motifsElimination || ''}
      </div>
    </td>
  ),
}

interface Props {
  projects: PaginatedList<Project> | Array<Project>
  displayColumns: Array<string>
  projectActions?: (
    project: Project
  ) => Array<{
    title: string
    link: string
    isDownload?: boolean
    actionId?: string
    projectId?: string
    disabled?: boolean
  }> | null
}

const ProjectList = ({ projects, displayColumns, projectActions }: Props) => {
  let items: Array<Project>
  if (Array.isArray(projects)) {
    items = projects
  } else {
    items = projects.items
  }

  if (!items.length) {
    return (
      <table className="table">
        <tbody>
          <tr>
            <td>Aucun projet à lister</td>
          </tr>
        </tbody>
      </table>
    )
  }

  return (
    <>
      <table className="table projectList" {...dataId('projectList-list')}>
        <thead>
          <tr>
            <th {...dataId('projectList-checkbox')} style={{ display: 'none' }}>
              <input
                type="checkbox"
                {...dataId('projectList-selectAll-checkbox')}
              />
            </th>
            {displayColumns?.map((column) => (
              <th key={column}>{column}</th>
            ))}
            {projectActions ? <th></th> : ''}
          </tr>
        </thead>
        <tbody>
          {items.map((project) => {
            return (
              <tr
                key={'project_' + project.id}
                {...dataId('projectList-item')}
                style={{ cursor: 'pointer' }}
                data-goto-projectid={project.id}
              >
                <td
                  {...dataId('projectList-checkbox')}
                  style={{ display: 'none' }}
                >
                  <input
                    type="checkbox"
                    {...dataId('projectList-item-checkbox')}
                    data-projectid={project.id}
                  />
                </td>
                {displayColumns?.map((column) => {
                  const Column = ColumnComponent[column]
                  return (
                    <Column
                      key={'project_' + project.id + '_' + column}
                      project={project}
                    />
                  )
                })}
                {projectActions ? (
                  <td {...dataId('item-actions-container')}>
                    <ProjectActions
                      projectActions={projectActions}
                      project={project}
                    />
                  </td>
                ) : (
                  ''
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
      {!Array.isArray(projects) ? (
        <Pagination
          pagination={projects.pagination}
          pageCount={projects.pageCount}
          itemTitle="Projets"
        />
      ) : (
        ''
      )}
    </>
  )
}

export default ProjectList
