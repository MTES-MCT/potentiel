import React from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { GarantiesFinancieresListDTO } from '../../modules/project/dtos/GarantiesFinancieresList'
import ROUTES from '../../routes'
import { HttpRequest } from '../../types'
import AdminDashboard from '../components/adminDashboard'




interface DREALListProps {
  request: HttpRequest
  garantiesFinancieres: GarantiesFinancieresListDTO
}

/* Pure component */
export default function DREALList({
  request,
  garantiesFinancieres,
}: DREALListProps) {
  const { error, success } = request.query || {}
  const { projects } = garantiesFinancieres
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
                <tr
                  key={'project_' + project.projectId}
                  {...dataId('gfList-item')}
                  data-goto-projectid={project.projectId}
                  style={{ cursor: 'pointer' }}
                >
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
                      Déposées le {formatDate(project.garantieFinanciere.date)}
                    </div>{' '}
                    {project.garantieFinanciere.file ? (
                      <a
                        href={ROUTES.DOWNLOAD_PROJECT_FILE(
                          project.garantieFinanciere.file.id,
                          project.garantieFinanciere.file.filename
                        )}
                        download={true}
                        {...dataId('gfList-item-download-link')}
                      >
                        Télécharger la pièce-jointe
                      </a>
                    ) : (
                      ''
                    )}
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
