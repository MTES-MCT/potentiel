import React from 'react'

import { Project, AppelOffre } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import { PaginatedList } from '../../types'

import ProjectActions from './projectActions'
import Pagination from './pagination'

interface Props {
  projects: PaginatedList<Project> | Array<Project>
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

const ProjectList = ({ projects, projectActions }: Props) => {
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
      <table className="table" {...dataId('projectList-list')}>
        <thead>
          <tr>
            <th>Periode</th>
            <th>Projet</th>
            <th>Candidat</th>
            <th>Puissance</th>
            <th>Prix</th>
            <th>Evaluation Carbone</th>
            <th>Classé</th>
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
                data-projectid={project.id}
              >
                <td valign="top">
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                    {...dataId('projectList-item-periode')}
                  >
                    {project.appelOffreId} Période {project.periodeId}
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                    {...dataId('projectList-item-famille')}
                  >
                    {project.familleId?.length
                      ? `famille ${project.familleId}`
                      : ''}
                  </div>
                </td>
                <td valign="top">
                  <div {...dataId('projectList-item-nomProjet')}>
                    {project.nomProjet}
                  </div>
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
                  </div>
                </td>
                <td valign="top">
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
                    <span {...dataId('projectList-item-email')}>
                      {project.email}
                    </span>
                  </div>
                </td>
                <td valign="top">
                  <span {...dataId('projectList-item-puissance')}>
                    {project.puissance}
                  </span>{' '}
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
                <td valign="top">
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
                <td valign="top">
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
                <td
                  valign="top"
                  className={
                    'notification ' +
                    (project.classe === 'Classé' ? 'success' : 'error')
                  }
                  style={{ position: 'relative' }}
                >
                  <div {...dataId('projectList-item-classe')}>
                    {project.classe === 'Classé' ||
                    !project.motifsElimination ? (
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
                <td {...dataId('item-actions-container')}>
                  <ProjectActions
                    projectActions={projectActions}
                    project={project}
                  />
                </td>
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
