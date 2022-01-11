import React from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { ModificationRequestListItemDTO } from '../../modules/modificationRequest'
import { UserRole } from '../../modules/users'
import ROUTES from '../../routes'
import { PaginatedList } from '../../types'
import { ModificationRequestColorByStatus, ModificationRequestStatusTitle } from '../helpers'
import ModificationRequestActionTitles from './ModificationRequestActionTitles'
import Pagination from './Pagination'

interface Props {
  modificationRequests?: PaginatedList<ModificationRequestListItemDTO>
  role?: UserRole
  requestActions?: (
    modificationRequest: ModificationRequestListItemDTO
  ) => Array<{ title: string; link: string; disabled?: boolean }> | null
}

const RequestList = ({ modificationRequests, role, requestActions }: Props) => {
  if (!modificationRequests?.itemCount) {
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
          {modificationRequests.items.map((modificationRequestItem) => {
            const {
              project,
              requestedBy,
              requestedOn,
              status,
              ...modificationRequest
            } = modificationRequestItem
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
                      Déposé par <a href={'mailto:' + requestedBy.email}>{requestedBy.fullName}</a>{' '}
                      le {formatDate(requestedOn)}
                    </div>
                  </div>
                </td>
                <td valign="top">
                  <div {...dataId('requestList-item-type')}>
                    <ModificationRequestActionTitles action={modificationRequest.type} />
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
                      <span>
                        {modificationRequest.puissance} {project.unitePuissance}
                      </span>
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
                </td>
                <td
                  valign="top"
                  className={
                    'notification ' + (status ? ModificationRequestColorByStatus[status] : '')
                  }
                  {...dataId('requestList-item-type')}
                >
                  {status ? ModificationRequestStatusTitle[status] : ''}
                </td>
                {requestActions && requestActions(modificationRequestItem) ? (
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
                      {requestActions(modificationRequestItem)?.map(
                        ({ title, link, disabled }, actionIndex) => (
                          <li
                            key={'request_action_' + modificationRequestItem.id + '_' + actionIndex}
                          >
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
      <Pagination
        pagination={modificationRequests.pagination}
        pageCount={modificationRequests.pageCount}
        itemTitle="Demandes"
      />
    </>
  )
}

export default RequestList
