import React from 'react'
import { ModificationRequest, User } from '../../entities'
import { ModificationRequestStatus } from '../../modules/modificationRequest'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import { titlePerAction } from '../pages/newModificationRequest'

const COLOR_BY_STATUS: Record<ModificationRequestStatus, 'danger' | 'success' | 'warning' | ''> = {
  envoyée: '',
  'en instruction': 'warning',
  acceptée: 'success',
  rejetée: 'danger',
  'en appel': 'warning',
  'en appel en instruction': 'warning',
  'en appel acceptée': 'success',
  'en appel rejetée': 'danger',
  annulée: '',
}

const TITLE_BY_STATUS: Record<ModificationRequestStatus, string> = {
  envoyée: 'Envoyée',
  'en instruction': 'En instruction',
  acceptée: 'Acceptée',
  rejetée: 'Rejetée',
  'en appel': 'En appel',
  'en appel en instruction': 'Appel en instruction',
  'en appel acceptée': 'Accepté en appel',
  'en appel rejetée': 'Appel rejeté',
  annulée: 'Annulée',
}

interface Props {
  modificationRequests?: Array<ModificationRequest>
  role?: User['role']
  requestActions?: (
    modificationRequest: ModificationRequest
  ) => Array<{ title: string; link: string; disabled?: boolean }> | null
}

const RequestList = ({ modificationRequests, role, requestActions }: Props) => {
  if (!modificationRequests || !modificationRequests.length) {
    return (
      <table className="table">
        <tbody>
          <tr>
            <td>Aucune demande n’a été trouvée</td>
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
          {modificationRequests.map(({ project, user, status, ...modificationRequest }) => {
            if (!project || !user) return ''
            return (
              <tr
                key={'modificationRequest_' + modificationRequest.id}
                style={{ cursor: 'pointer' }}
                data-goto-onclick={ROUTES.DEMANDE_PAGE_DETAILS(modificationRequest.id)}
              >
                <td valign="top">
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                    {...dataId('requestList-item-periode')}
                  >
                    {project.appelOffreId} Période {project.periodeId}
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12,
                    }}
                    {...dataId('requestList-item-famille')}
                  >
                    {project.familleId?.length ? `famille ${project.familleId}` : ''}
                  </div>
                </td>
                <td valign="top">
                  <div {...dataId('requestList-item-nomProjet')}>{project.nomProjet}</div>
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
                    <span {...dataId('requestList-item-regionProjet')}>{project.regionProjet}</span>
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
                    {modificationRequest.attachmentFile ? (
                      <a
                        href={ROUTES.DOWNLOAD_PROJECT_FILE(
                          modificationRequest.attachmentFile.id,
                          modificationRequest.attachmentFile.filename
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
                  {modificationRequest.type === 'recours' &&
                  role &&
                  ['admin', 'dgec'].includes(role) ? (
                    <div
                      style={{
                        fontStyle: 'italic',
                        lineHeight: 'normal',
                        fontSize: 12,
                      }}
                    >
                      <a
                        href={ROUTES.TELECHARGER_MODELE_REPONSE_RECOURS(
                          project,
                          modificationRequest.id
                        )}
                        download={true}
                      >
                        Télécharger modèle de réponse
                      </a>
                    </div>
                  ) : (
                    ''
                  )}
                </td>
                <td
                  valign="top"
                  className={'notification ' + (status ? COLOR_BY_STATUS[status] : '')}
                  {...dataId('requestList-item-type')}
                >
                  {status ? TITLE_BY_STATUS[status] : ''}
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
                          <li key={'request_action_' + modificationRequest.id + '_' + actionIndex}>
                            {disabled ? (
                              <i>{title}</i>
                            ) : (
                              <a href={link} {...dataId('requestList-item-action')}>
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
