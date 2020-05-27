import AdminDashboard from '../components/adminDashboard'

import React from 'react'
import moment from 'moment'
import pagination from '../../__tests__/fixtures/pagination'

import { Project, AppelOffre, Periode, REGIONS, User } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import ProjectList from '../components/projectList'
import { HttpRequest } from '../../types'

interface DREALListProps {
  request: HttpRequest
  projects: Array<Project>
}

/* Pure component */
export default function DREALList({ request, projects }: DREALListProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard
      role={request.user?.role}
      currentPage="list-garanties-financieres"
    >
      <div className="panel">
        <div className="panel__header">
          <h3>Garanties Financières déposées</h3>
        </div>
        <table className="table" {...dataId('gfList-list')}>
          <thead>
            <tr>
              <th>Periode</th>
              <th>Projet</th>
              <th>Candidat</th>
              <th>Garanties Financières</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              return (
                <tr key={'project_' + project.id} {...dataId('gfList-item')}>
                  <td valign="top">
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                      {...dataId('gfList-item-periode')}
                    >
                      {project.appelOffreId} Période {project.periodeId}
                    </div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                      {...dataId('gfList-item-famille')}
                    >
                      {project.familleId?.length
                        ? `famille ${project.familleId}`
                        : ''}
                    </div>
                  </td>
                  <td valign="top">
                    <div {...dataId('gfList-item-nomProjet')}>
                      {project.nomProjet}
                    </div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                    >
                      <span {...dataId('gfList-item-communeProjet')}>
                        {project.communeProjet}
                      </span>
                      ,{' '}
                      <span {...dataId('gfList-item-departementProjet')}>
                        {project.departementProjet}
                      </span>
                      ,{' '}
                      <span {...dataId('gfList-item-regionProjet')}>
                        {project.regionProjet}
                      </span>
                    </div>
                  </td>
                  <td valign="top">
                    <div {...dataId('gfList-item-nomCandidat')}>
                      {project.nomCandidat}
                    </div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                    >
                      <span {...dataId('gfList-item-nomRepresentantLegal')}>
                        {project.nomRepresentantLegal}
                      </span>{' '}
                      <span {...dataId('gfList-item-email')}>
                        {project.email}
                      </span>
                    </div>
                  </td>
                  <td valign="top">
                    <div {...dataId('gfList-item-garanties-financieres')}>
                      Déposées le{' '}
                      {moment(project.garantiesFinancieresDate).format(
                        'DD/MM/YYYY'
                      )}
                    </div>{' '}
                    <a
                      href={ROUTES.DOWNLOAD_PROJECT_FILE(
                        project.id,
                        project.garantiesFinancieresFile
                      )}
                      download={true}
                      {...dataId('gfList-item-download-link')}
                    >
                      Télécharger la pièce-jointe
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AdminDashboard>
  )
}
