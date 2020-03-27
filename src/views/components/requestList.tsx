import React from 'react'

import { ModificationRequest, Project, User } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import { titlePerAction } from '../pages/modificationRequest'

interface HasProjectAndUser {
  project: Project
  user: User
}

interface Props {
  modificationRequests?: Array<ModificationRequest & HasProjectAndUser>
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
            <th>Projet</th>
            <th>Type</th>
            <th>Status</th>
            {requestActions ? <th></th> : ''}
          </tr>
        </thead>
        <tbody>
          {modificationRequests.map(
            ({ project, user, ...modificationRequest }) => (
              <tr key={'modificationRequest_' + modificationRequest.id}>
                <td valign="top">
                  <div {...dataId('requestList-item-nomProjet')}>
                    {project.nomProjet}
                  </div>
                  <div
                    style={{
                      fontStyle: 'italic',
                      lineHeight: 'normal',
                      fontSize: 12
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
                      fontSize: 12
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
                </td>
                <td valign="top" {...dataId('requestList-item-type')}>
                  En cours d'instruction
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
          )}
        </tbody>
      </table>
      <nav className="pagination">
        <div className="pagination__display-group">
          <label
            htmlFor="pagination__display"
            className="pagination__display-label"
          >
            Projets par page
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
      </nav>
    </>
  )
}

export default RequestList
