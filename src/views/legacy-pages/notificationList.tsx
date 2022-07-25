import { AdminDashboard, PaginationPanel, Button } from '@components'
import { FailedNotificationDTO } from '@modules/notification'
import ROUTES from '@routes'
import { Request } from 'express'
import React from 'react'
import { formatDate } from '../../helpers/formatDate'
import { dataId } from '../../helpers/testId'
import { PaginatedList } from '../../types'
interface NotificationListProps {
  request: Request
  notifications: PaginatedList<FailedNotificationDTO>
}

/* Pure component */
export default function NotificationList({ request, notifications }: NotificationListProps) {
  const { error, success } = (request.query as any) || {}

  return (
    <AdminDashboard role={request.user?.role} currentPage="list-notifications">
      <div className="panel">
        <div className="panel__header">
          <h3>Notifications en erreur</h3>
          <p>Sont listées uniquement les notifications qui ont un status &quot;erreur&quot;.</p>
        </div>
        <div className="panel__header">
          <form
            action={ROUTES.ADMIN_NOTIFICATION_RETRY_ACTION}
            method="POST"
            style={{ maxWidth: 'auto', margin: '0 0 25px 0' }}
          >
            {notifications.itemCount && (
              <Button
                className="mt-3"
                type="submit"
                name="submit"
                id="submit"
                primary
                {...dataId('submit-button')}
              >
                Réessayer toutes les notifications en erreur
              </Button>
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
                      <td
                        valign="top"
                        className="notification error"
                        style={{ position: 'relative' }}
                      >
                        <div>Echec de l‘envoi</div>
                        <div
                          style={{
                            fontStyle: 'italic',
                            lineHeight: 'normal',
                            fontSize: 12,
                          }}
                        >
                          {notification.error || ''}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!Array.isArray(notifications) ? (
              <PaginationPanel
                pagination={notifications.pagination}
                pageCount={notifications.pageCount}
                itemTitle="Notifications"
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
