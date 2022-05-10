import { Request } from 'express'
import React from 'react'
import { DREAL, REGIONS, User } from '@entities'
import { dataId } from '../../helpers/testId'
import ROUTES from '../../routes'
import AdminDashboard from '../components/AdminDashboard'
import { Button, Input, Select } from '../components'

interface DREALListProps {
  request: Request
  users: Array<{ user: User; dreals: Array<DREAL> }>
}

/* Pure component */
export default function DREALList({ request, users }: DREALListProps) {
  const { error, success } = (request.query as any) || {}

  return (
    <AdminDashboard role={request.user?.role} currentPage="list-dreal">
      <div className="panel">
        <div className="panel__header">
          <h3>Les DREALs</h3>
        </div>
        <div className="panel__header">
          <h5>Ajouter un utilisateur DREAL</h5>

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
            action={ROUTES.ADMIN_INVITE_DREAL_USER_ACTION}
            method="post"
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="role" value="dreal" />
            <div>
              <label htmlFor="email">Adresse email</label>
              <Input type="email" name="email" id="email" {...dataId('email-field')} required />
            </div>
            <div>
              <label htmlFor="region">Sélectionnez une région</label>
              <Select
                name="region"
                id="region"
                options={[...REGIONS]}
                {...dataId('region-field')}
                required
              />
            </div>
            <Button
              type="submit"
              primary
              id="submit"
              {...dataId('submit-button')}
              className="m-auto"
            >
              Inviter
            </Button>
          </form>
        </div>
        {users && users.length && (
          <>
            <h5>Les utilisateurs rattachés à une DREAL</h5>
            <table className="table" {...dataId('projectList-list')}>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>DREAL(s)</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ user, dreals }) => {
                  return (
                    <tr key={'user_' + user.id} {...dataId('drealList-item')}>
                      <td valign="top">
                        {user.fullName} ({user.email})
                      </td>
                      <td valign="top">{dreals.join(', ')}</td>
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
}
