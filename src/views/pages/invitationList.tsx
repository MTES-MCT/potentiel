import AdminDashboard from '../components/adminDashboard'
import Pagination from '../components/pagination'

import React from 'react'
import moment from 'moment'

import {
  Project,
  AppelOffre,
  Periode,
  Famille,
  ProjectAdmissionKey,
} from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'
import { asLiteral } from '../../helpers/asLiteral'

import { adminActions } from '../components/actions'
import { HttpRequest, PaginatedList } from '../../types'

interface InvitationListProps {
  request: HttpRequest
  invitations: PaginatedList<ProjectAdmissionKey>
}

/* Pure component */
export default function InvitationList({
  request,
  invitations,
}: InvitationListProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard role={request.user?.role} currentPage="list-invitations">
      <div className="panel">
        <div className="panel__header">
          <h3>Invitations en cours</h3>
          <p>
            Sont listées uniquement les invitations qui n'ont pas donné lieu à
            une inscription
          </p>
        </div>
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
        {invitations.itemCount ? (
          <form action={ROUTES.ADMIN_INVITATION_RELANCE_ACTION} method="POST">
            <button
              className="button"
              type="submit"
              name="submit"
              id="submit"
              {...dataId('submit-button')}
            >
              Relancer les {invitations.itemCount} porteurs de projet
              non-inscrits
            </button>
          </form>
        ) : (
          ''
        )}
        <div className="pagination__count">
          <strong>{invitations.itemCount}</strong> invitations
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
            <table className="table" {...dataId('invitationList-list')}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Date d'invitation</th>
                </tr>
              </thead>
              <tbody>
                {invitations.items.map((invitation) => {
                  return (
                    <tr
                      key={'invitation_' + invitation.id}
                      {...dataId('invitationList-item')}
                    >
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
                        {moment(invitation.createdAt).format(
                          'DD/MM/YYYY HH:mm'
                        )}
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
