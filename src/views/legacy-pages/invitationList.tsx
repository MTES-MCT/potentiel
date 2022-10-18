import { AdminDashboard, PageTemplate, PaginationPanel, SecondaryButton } from '@components'
import { PendingCandidateInvitationDTO } from '@modules/candidateNotification'
import ROUTES from '@routes'
import { Request } from 'express'
import React from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { PaginatedList } from '../../types'

interface InvitationListProps {
  request: Request
  invitations: PaginatedList<PendingCandidateInvitationDTO>
}

export default function InvitationList({ request, invitations }: InvitationListProps) {
  const { error, success } = (request.query as any) || {}

  return (
    <PageTemplate user={request.user}>
      <AdminDashboard role={request.user?.role} currentPage="list-invitations">
        <div className="panel">
          <div className="panel__header">
            <h3>Invitations de candidats en attente</h3>
            <p>
              Sont listées uniquement les invitations de candidats qui n‘ont pas donné lieu à une
              inscription. Les parrainages ne sont pas inclus.
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

          <div className="pagination__count">
            <strong>{invitations.itemCount}</strong> invitations en attente{' '}
          </div>
          {!invitations.items.length ? (
            <table className="table">
              <tbody>
                <tr>
                  <td>Aucune</td>
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
                      <tr key={'invitation_' + invitation.email} {...dataId('invitationList-item')}>
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
                          {invitation.invitedOn
                            ? formatDate(invitation.invitedOn, 'DD/MM/YYYY HH:mm')
                            : ''}
                        </td>
                        <td>
                          <form
                            action={ROUTES.ADMIN_INVITATION_RELANCE_ACTION}
                            method="POST"
                            style={{}}
                          >
                            <input type="hidden" name="email" value={invitation.email} />
                            <SecondaryButton type="submit" name="submit" className="border-none">
                              relancer
                            </SecondaryButton>
                          </form>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {!Array.isArray(invitations) ? (
                <PaginationPanel
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
    </PageTemplate>
  )
}
