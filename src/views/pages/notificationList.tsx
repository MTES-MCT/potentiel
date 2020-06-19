import AdminDashboard from '../components/adminDashboard'
import Pagination from '../components/pagination'

import React from 'react'
import moment from 'moment'

import {
  Project,
  AppelOffre,
  Periode,
  Famille,
  Notification,
} from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'
import { asLiteral } from '../../helpers/asLiteral'

import { adminActions } from '../components/actions'
import { HttpRequest, PaginatedList } from '../../types'
import { isFunction } from 'util'
import { date } from 'yup'

interface NotificationListProps {
  request: HttpRequest
  notifications: PaginatedList<Notification>
}

/* Pure component */
export default function NotificationList({
  request,
  notifications,
}: NotificationListProps) {
  const { error, success } = request.query || {}

  return (
    <AdminDashboard role={request.user?.role} currentPage="list-notifications">
      <div className="panel">
        <div className="panel__header">
          <h3>Notifications en erreur</h3>
          <p>
            Sont listées uniquement les notifications qui ont un status
            "erreur".
          </p>
        </div>
        <div className="panel__header">
          <form
            action={ROUTES.ADMIN_NOTIFICATION_RETRY_ACTION}
            method="POST"
            style={{ maxWidth: 'auto', margin: '0 0 25px 0' }}
          >
            {notifications.itemCount ? (
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                style={{ marginTop: 10 }}
                {...dataId('submit-button')}
              >
                Relancer les {notifications.itemCount} notifications en erreur
              </button>
            ) : (
              ''
            )}
          </form>
          {success ? (
            <div
              className="notification success"
              {...dataId('success-message')}
            >
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
            <table
              className="table"
              style={{ width: '100%' }}
              {...dataId('notificationList-list')}
            >
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
                        {notification.message.email} {notification.message.name}
                      </td>
                      <td>{notification.type}</td>
                      <td>
                        {moment(notification.createdAt).format(
                          'DD/MM/YYYY HH:mm'
                        )}
                      </td>
                      <td
                        valign="top"
                        className={
                          'notification ' +
                          (notification.status === 'sent'
                            ? 'success'
                            : notification.status === 'retried'
                            ? 'warning'
                            : 'error')
                        }
                        style={{ position: 'relative' }}
                      >
                        <div>{notification.status}</div>

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
              <Pagination
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
