import AdminDashboard from '../components/adminDashboard'

import React from 'react'
import moment from 'moment'
import pagination from '../../__tests__/fixtures/pagination'

import { Project, AppelOffre, Periode, REGIONS, User } from '../../entities'
import ROUTES from '../../routes'
import { dataId } from '../../helpers/testId'

import ProjectList from '../components/projectList'
import { HttpRequest } from '../../types'

interface DREALListProps {
  request: HttpRequest
  users: Array<User>
}

/* Pure component */
export default function DREALList({ request, users }: DREALListProps) {
  const { error, success } = request.query || {}
  return (
    <AdminDashboard currentPage="list-dreal">
      <div className="panel">
        <div className="panel__header">
          <h3>Les DREALs</h3>
        </div>
        <div className="panel__header">
          <h5>Ajouter un utilisateur DREAL</h5>

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
          <form
            action={ROUTES.ADMIN_INVITE_DREAL_ACTION}
            method="post"
            style={{ maxWidth: 'auto', margin: '0 0 15px 0' }}
          >
            <div className="form__group">
              <label htmlFor="email">Adresse email</label>
              <input
                type="text"
                name="email"
                id="email"
                {...dataId('email-field')}
                style={{ width: 'auto' }}
              />
              <select name="region" id="region" {...dataId('region-field')}>
                {[...REGIONS]
                  .sort((a, b) => a.localeCompare(b))
                  .map((region, index) => (
                    <option key={'region_' + index} value={region}>
                      {region}
                    </option>
                  ))}
              </select>
              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Inviter
              </button>
            </div>
          </form>
        </div>
        <h5>Les utilisateurs rattachés à une DREAL</h5>
      </div>
    </AdminDashboard>
  )
}
