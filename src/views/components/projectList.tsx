import React from 'react'

import { Project, CandidateNotification, AppelOffre } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import { appelsOffreStatic } from '../../dataAccess'

import { PaginatedList } from '../../types'

import Pagination from './pagination'

interface Props {
  projects: PaginatedList<Project> | Array<Project>
  projectActions?: (
    project: Project,
    appelOffre?: AppelOffre
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
            const appelOffre = appelsOffreStatic.find(
              (item) => item.id === project.appelOffreId
            )
            return (
              <tr key={'project_' + project.id}>
                <td valign="top">
                  <div {...dataId('projectList-item-periode')}>
                    {project.periodeId}
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
                      ? `famille ${project.familleId}`
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
                    {appelOffre?.powerUnit}
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
                >
                  <div {...dataId('projectList-item-classe')}>
                    {project.classe}
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                    {...dataId('projectList-item-motifsElimination')}
                  >
                    {project.motifsElimination || ''}
                  </div>
                </td>
                {projectActions && projectActions(project, appelOffre) ? (
                  <td style={{ position: 'relative' }}>
                    <img
                      src="/images/icons/external/more.svg"
                      height="12"
                      width="12"
                      style={{ cursor: 'pointer' }}
                      tabIndex={0}
                      className="list--action-trigger"
                    />
                    <ul className="list--action-menu">
                      {projectActions(project, appelOffre)?.map(
                        (
                          {
                            title,
                            actionId,
                            projectId,
                            link,
                            disabled,
                            isDownload,
                          },
                          actionIndex
                        ) => (
                          <li key={'notif_' + project.id + '_' + actionIndex}>
                            {disabled ? (
                              <i>{title}</i>
                            ) : (
                              <a
                                href={link}
                                download={isDownload}
                                data-actionid={actionId}
                                data-projectid={projectId}
                                {...dataId('projectList-item-action')}
                              >
                                {title}
                              </a>
                            )}
                          </li>
                        )
                      )}
                    </ul>
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
