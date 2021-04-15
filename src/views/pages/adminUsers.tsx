import { Request } from 'express'
import React from 'react'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import AdminDashboard from '../components/adminDashboard'

interface AdminUsersProps {
  request: Request
}

/* Pure component */
export default function AdminUsers({ request }: AdminUsersProps) {
  const { error, success } = (request.query as any) || {}
  return (
    <AdminDashboard role={request.user?.role} currentPage="admin-users">
      <div className="panel">
        <div className="panel__header">
          <h3>Utilisateurs</h3>
        </div>
        <div className="panel__header">
          <h5>Ajouter un utilisateur</h5>

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
          <form
            action={ROUTES.ADMIN_INVITE_USER_ACTION}
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
              <select name="role" {...dataId('role-field')}>
                <option value="acheteur-obligé">Acheteur obligé</option>
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
      </div>
    </AdminDashboard>
  )
}
