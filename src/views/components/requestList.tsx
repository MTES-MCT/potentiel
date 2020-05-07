import React from 'react'

import { ModificationRequest, Project, User } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'
import { makeProjectFilePath } from '../../helpers/makeProjectFilePath'

import { titlePerAction } from '../pages/modificationRequest'

interface Props {
  modificationRequests?: Array<ModificationRequest>
  requestActions?: (
    modificationRequest: ModificationRequest
  ) => Array<{ title: string; link: string; disabled?: boolean }> | null
}

const RequestList = ({ modificationRequests, requestActions }: Props) => {
  // console.log('RequestList received', modificationRequests)

  if (!modificationRequests || !modificationRequests.length) {
    return (
      <table className="table">
        <tbody>
          <tr>
            <td>Aucune demande n'a été trouvée</td>
          </tr>
        </tbody>
      </table>
    )
  }

  return (
    <>
      <table className="table" {...dataId('requestList-list')}>
        <thead>
          <tr>
            <th>Période</th>
            <th>Projet</th>
            <th>Type</th>
            <th>Statut</th>
            {requestActions ? <th></th> : ''}
          </tr>
        </thead>
        <tbody>
          {modificationRequests.map(
            ({ project, user, status, ...modificationRequest }) => {
              if (!project || !user) return ''
              return (
                <tr key={'modificationRequest_' + modificationRequest.id}>
                  <td valign="top">
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                      {...dataId('requestList-item-periode')}
                    >
                      {project.appelOffreId} Période {project.periodeId}
                    </div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                      {...dataId('requestList-item-famille')}
                    >
                      {project.familleId?.length
                        ? `famille ${project.familleId}`
                        : ''}
                    </div>
                  </td>
                  <td valign="top">
                    <div {...dataId('requestList-item-nomProjet')}>
                      {project.nomProjet}
                    </div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                    >
                      <span {...dataId('requestList-item-communeProjet')}>
                        {project.communeProjet}
                      </span>
                      ,{' '}
                      <span {...dataId('requestList-item-departementProjet')}>
                        {project.departementProjet}
                      </span>
                      ,{' '}
                      <span {...dataId('requestList-item-regionProjet')}>
                        {project.regionProjet}
                      </span>
                      <div {...dataId('requestList-item-email')}>
                        <a href={'mailto:' + project.email}>{project.email}</a>
                      </div>
                    </div>
                  </td>
                  <td valign="top">
                    <div {...dataId('requestList-item-type')}>
                      {titlePerAction[modificationRequest.type]}
                    </div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                    >
                      {modificationRequest.type === 'actionnaire' ? (
                        <span>{modificationRequest.actionnaire}</span>
                      ) : modificationRequest.type === 'fournisseur' ? (
                        <span>{modificationRequest.fournisseur}</span>
                      ) : modificationRequest.type === 'producteur' ? (
                        <span>{modificationRequest.producteur}</span>
                      ) : modificationRequest.type === 'puissance' ? (
                        <span>{modificationRequest.puissance} kWc</span>
                      ) : (
                        ''
                      )}
                    </div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                    >
                      {modificationRequest.type === 'recours' ||
                      modificationRequest.type === 'abandon' ||
                      modificationRequest.type === 'delai' ||
                      modificationRequest.type === 'fournisseur'
                        ? modificationRequest?.justification
                        : ''}
                    </div>
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                    >
                      {modificationRequest.filename ? (
                        <a
                          href={ROUTES.DOWNLOAD_PROJECT_FILE(
                            modificationRequest.projectId,
                            modificationRequest.filename
                          )}
                          download={true}
                          {...dataId('requestList-item-download-link')}
                        >
                          Télécharger la pièce-jointe
                        </a>
                      ) : (
                        ''
                      )}
                    </div>
                  </td>
                  <td
                    valign="top"
                    className={
                      'notification' +
                      (status === 'validée'
                        ? ' success'
                        : status === 'refusée'
                        ? ' error'
                        : status === 'en instruction' ||
                          status === 'en validation'
                        ? ' warning'
                        : '')
                    }
                    {...dataId('requestList-item-type')}
                  >
                    {status === 'envoyée'
                      ? 'Envoyée'
                      : status === 'en instruction'
                      ? 'En instruction'
                      : status === 'en validation'
                      ? 'En attente de validation'
                      : status === 'validée'
                      ? 'Validée'
                      : status === 'refusée'
                      ? 'Refusée'
                      : 'N/A'}
                  </td>
                  {requestActions && requestActions(modificationRequest) ? (
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
                        {requestActions(modificationRequest)?.map(
                          ({ title, link, disabled }, actionIndex) => (
                            <li
                              key={
                                'request_action_' +
                                modificationRequest.id +
                                '_' +
                                actionIndex
                              }
                            >
                              {disabled ? (
                                <i>{title}</i>
                              ) : (
                                <a
                                  href={link}
                                  {...dataId('requestList-item-action')}
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
            }
          )}
        </tbody>
      </table>
      {/* <nav className="pagination">
        <div className="pagination__display-group">
          <label
            htmlFor="pagination__display"
            className="pagination__display-label"
          >
            Demandes par page
          </label>
          <select className="pagination__display" id="pagination__display">
            <option>5</option>
            <option>10</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
        <div className="pagination__count">
          <strong>{modificationRequests?.length}</strong> sur{' '}
          <strong>{modificationRequests?.length}</strong>
        </div>
        <ul className="pagination__pages" style={{ display: 'none' }}>
          <li className="disabled">
            <a>❮ Précédent</a>
          </li>
          <li className="active">
            <a>1</a>
          </li>
          <li>
            <a>2</a>
          </li>
          <li>
            <a>3</a>
          </li>
          <li>
            <a>4</a>
          </li>
          <li className="disabled">
            <a>5</a>
          </li>
          <li>
            <a>Suivant ❯</a>
          </li>
        </ul>
      </nav> */}
    </>
  )
}

export default RequestList
