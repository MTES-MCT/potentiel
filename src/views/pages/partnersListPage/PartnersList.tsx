import { Request } from 'express'
import React from 'react'
import { User } from '@entities'
import { dataId } from '../../../helpers/testId'
import ROUTES from '../../../routes'
import AdminDashboard from '../../components/AdminDashboard'
import { PageLayout, SuccessErrorBox } from '../../components'
import { hydrateOnClient } from '../../../views/helpers'

interface AdminUsersProps {
  request: Request
  users: Array<User>
}

/* Pure component */
export const PartnersList = PageLayout(({ request, users }: AdminUsersProps) => {
  const { error, success } = (request.query as any) || {}

  return (
    <AdminDashboard role={request.user?.role} currentPage="admin-users">
      <div className="panel">
        <div className="panel__header">
          <h1 className="text-2xl">Utilisateurs partenaires</h1>
        </div>
        <div className="panel__header">
          <h2 className="text-lg">Ajouter un utilisateur</h2>

          <SuccessErrorBox success={success} error={error} />
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
                <option value="ademe">ADEME</option>
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
        {Boolean(users?.length) && (
          <>
            <h2 className="text-lg">Liste des utilisateurs</h2>
            <table className="table" {...dataId('projectList-list')}>
              <thead>
                <tr>
                  <th>Nom (email)</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ id, fullName, email, role }) => {
                  return (
                    <tr key={'user_' + id} {...dataId('userList-item')}>
                      <td valign="top">
                        {fullName} ({email})
                      </td>
                      <td valign="top">{role}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </AdminDashboard>
  )
})

hydrateOnClient(PartnersList)
