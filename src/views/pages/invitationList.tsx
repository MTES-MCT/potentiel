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
import { isFunction } from 'util'
import { date } from 'yup'

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

  const beforeDate = request.query.beforeDate
    ? Number(request.query.beforeDate)
    : undefined

  let dateSelection: '2weeks' | '1month' | 'all' | 'other' = 'all'

  if (beforeDate) {
    if (
      Math.abs(
        moment().subtract(2, 'weeks').diff(moment(beforeDate), 'days')
      ) <= 1
    ) {
      dateSelection = '2weeks'
    } else if (
      Math.abs(
        moment().subtract(1, 'month').diff(moment(beforeDate), 'days')
      ) <= 1
    ) {
      dateSelection = '1month'
    } else {
      dateSelection = 'other'
    }
  }

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
        <div className="panel__header">
          <form
            action={ROUTES.ADMIN_INVITATION_RELANCE_ACTION}
            method="POST"
            style={{ maxWidth: 'auto', margin: '0 0 25px 0' }}
          >
            <div className="form__group">
              <legend>Filtrer par ancienneté de l'invitation</legend>
              <select
                name="beforeDate"
                id="beforeDate"
                {...dataId('beforeDateSelector')}
              >
                {dateSelection === 'other' ? (
                  <option value={beforeDate} selected>
                    Avant le {moment(beforeDate).format('DD/MM/YYYY')}
                  </option>
                ) : (
                  ''
                )}
                <option
                  value={moment().subtract(2, 'weeks').toDate().getTime()}
                  selected={dateSelection === '2weeks'}
                >
                  Plus de 2 semaines
                </option>
                <option
                  value={moment().subtract(1, 'month').toDate().getTime()}
                  selected={dateSelection === '1month'}
                >
                  Plus d'un mois
                </option>
                <option value="" selected={dateSelection === 'all'}>
                  Toutes
                </option>
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
                Relancer les {invitations.itemCount} invitations de cette
                période
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
          <strong>{invitations.itemCount}</strong> invitations{' '}
          {beforeDate
            ? `envoyées avant le ${moment(beforeDate).format('DD/MM/YYYY')}`
            : ''}
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
            <table
              className="table"
              style={{ width: '100%' }}
              {...dataId('invitationList-list')}
            >
              <thead>
                <tr>
                  <th>Email</th>
                  <th style={{ width: 150 }}>Date d'invitation</th>
                  <th style={{ width: 100 }}></th>
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
