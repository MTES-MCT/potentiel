import React from 'react'
import { AppelOffre, ProjectAdmissionKey } from '../../entities'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import { HttpRequest, PaginatedList } from '../../types'
import AdminDashboard from '../components/adminDashboard'
import Pagination from '../components/pagination'
interface InvitationListProps {
  request: HttpRequest
  invitations: PaginatedList<ProjectAdmissionKey>
  appelsOffre: Array<AppelOffre>
}

/* Pure component */
export default function InvitationList({ request, invitations, appelsOffre }: InvitationListProps) {
  const { error, success, appelOffreId, periodeId } = request.query || {}

  return (
    <AdminDashboard role={request.user?.role} currentPage="list-invitations">
      <div className="panel">
        <div className="panel__header">
          <h3>Invitations en cours</h3>
          <p>Sont listées uniquement les invitations qui n‘ont pas donné lieu à une inscription</p>
        </div>
        <div className="panel__header">
          <form
            action={ROUTES.ADMIN_INVITATION_RELANCE_ACTION}
            method="POST"
            style={{ maxWidth: 'auto', margin: '0 0 25px 0' }}
          >
            <div className="form__group">
              <legend>Filtrer par AO, Période et/ou Famille</legend>
              <select name="appelOffreId" {...dataId('appelOffreIdSelector')}>
                <option value="">Tous AO</option>
                {appelsOffre.map((appelOffre) => (
                  <option
                    key={'appel_' + appelOffre.id}
                    value={appelOffre.id}
                    selected={appelOffre.id === appelOffreId}
                  >
                    {appelOffre.shortTitle}
                  </option>
                ))}
              </select>
              <select name="periodeId" {...dataId('periodeIdSelector')}>
                <option value="">Toutes périodes</option>
                {appelsOffre
                  .find((ao) => ao.id === appelOffreId)
                  ?.periodes.map((periode) => (
                    <option
                      key={'appel_' + periode.id}
                      value={periode.id}
                      selected={periode.id === periodeId}
                    >
                      {periode.title}
                    </option>
                  ))}
              </select>
            </div>
            {invitations.itemCount ? (
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                style={{ marginTop: 10 }}
                {...dataId('submit-button')}
              >
                Relancer les {invitations.itemCount} invitations de cette période
              </button>
            ) : (
              ''
            )}
          </form>
          {success ? (
            <div className="notification success" {...dataId('success-message')}>
              {success}
            </div>
          ) : (
            ''
          )}
          {error ? (
            <div className="notification error" {...dataId('error-message')}>
              {error}
            </div>
          ) : (
            ''
          )}
        </div>

        <div className="pagination__count">
          <strong>{invitations.itemCount}</strong> invitations{' '}
        </div>
        {!invitations.items.length ? (
          <table className="table">
            <tbody>
              <tr>
                <td>Aucune invitation à lister</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            <table className="table" style={{ width: '100%' }} {...dataId('invitationList-list')}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th style={{ width: 150 }}>Date d‘invitation</th>
                  <th style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {invitations.items.map((invitation) => {
                  return (
                    <tr key={'invitation_' + invitation.id} {...dataId('invitationList-item')}>
                      <td>
                        {invitation.email}{' '}
                        {invitation.fullName ? (
                          <div
                            style={{
                              fontStyle: 'italic',
                              lineHeight: 'normal',
                              fontSize: 12,
                            }}
                          >
                            {invitation.fullName}
                          </div>
                        ) : (
                          ''
                        )}
                      </td>
                      <td>
                        {invitation.createdAt
                          ? formatDate(invitation.createdAt, 'DD/MM/YYYY HH:mm')
                          : ''}
                      </td>
                      <td>
                        <form
                          action={ROUTES.ADMIN_INVITATION_RELANCE_ACTION}
                          method="POST"
                          style={{}}
                        >
                          <select name="keys" multiple hidden>
                            <option value={invitation.id} selected></option>
                          </select>
                          <button
                            className="button-outline primary"
                            type="submit"
                            name="submit"
                            style={{ border: 0 }}
                          >
                            relancer
                          </button>
                        </form>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!Array.isArray(invitations) ? (
              <Pagination
                pagination={invitations.pagination}
                pageCount={invitations.pageCount}
                itemTitle="Invitations"
              />
            ) : (
              ''
            )}
          </>
        )}
      </div>
    </AdminDashboard>
  )
}
