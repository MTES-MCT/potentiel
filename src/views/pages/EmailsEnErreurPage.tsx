import { PaginationPanel, Button, PageTemplate, SuccessBox, ErrorBox, Heading1 } from '@components'
import { FailedNotificationDTO } from '@modules/notification'
import ROUTES from '@routes'
import { Request } from 'express'
import React from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { PaginatedList } from '../../types'
import { hydrateOnClient } from '../helpers'
type EmailsEnErreurProps = {
  request: Request
  notifications: PaginatedList<FailedNotificationDTO>
}

export const EmailsEnErreur = ({ request, notifications }: EmailsEnErreurProps) => {
  const { error, success } = (request.query as any) || {}

  return (
    <PageTemplate user={request.user} currentPage="list-notifications">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Emails en erreur</Heading1>
          <p>
            Sont listés uniquement les emails de notification qui ont un status &quot;erreur&quot;.
          </p>
        </div>
        <div className="panel__header">
          <form
            action={ROUTES.ADMIN_NOTIFICATION_RETRY_ACTION}
            method="POST"
            style={{ maxWidth: 'auto', margin: '0 0 25px 0' }}
          >
            {!!notifications.itemCount && (
              <Button
                className="mt-3"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Réessayer toutes les notifications en erreur
              </Button>
            )}
          </form>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
        </div>

        <div className="m-2">
          <strong>{notifications.itemCount}</strong> notifications{' '}
        </div>
        {!notifications.items.length ? (
          <table className="table">
            <tbody>
              <tr>
                <td>Aucune notification à lister</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <>
            <table className="table" style={{ width: '100%' }} {...dataId('notificationList-list')}>
              <thead>
                <tr>
                  <th>Destinataire</th>
                  <th style={{ width: 150 }}>Type</th>
                  <th style={{ width: 100 }}>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {notifications.items.map((notification) => {
                  return (
                    <tr
                      key={'notification_' + notification.id}
                      {...dataId('notificationList-item')}
                    >
                      <td>
                        {notification.recipient.email} {notification.recipient.name}
                      </td>
                      <td>{notification.type}</td>
                      <td>
                        {notification.createdAt
                          ? formatDate(notification.createdAt, 'DD/MM/YYYY HH:mm')
                          : ''}
                      </td>
                      <td valign="top" className="relative">
                        {notification.error && (
                          <ErrorBox title="Echec de l‘envoi">
                            <div className="italic leading-normal text-xs">
                              {notification.error}
                            </div>
                          </ErrorBox>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!Array.isArray(notifications) && (
              <PaginationPanel
                nombreDePage={notifications.pageCount}
                pagination={{
                  limiteParPage: notifications.pagination.pageSize,
                  page: notifications.pagination.page,
                }}
                titreItems="Notifications"
              />
            )}
          </>
        )}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(EmailsEnErreur)
