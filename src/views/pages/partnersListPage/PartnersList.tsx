import { Request } from 'express'
import React from 'react'
import { User } from '@entities'
import { dataId } from '../../../helpers/testId'
import ROUTES from '../../../routes'
import AdminDashboard from '../../components/AdminDashboard'
import { Button, Input, PageLayout, SuccessErrorBox } from '../../components'
import { hydrateOnClient } from '../../../views/helpers'

type PartnersListProps = {
  request: Request
  users: Array<User>
  validationErrors?: Array<{ [fieldName: string]: string }>
}

/* Pure component */
export const PartnersList = PageLayout(
  ({ request, users, validationErrors }: PartnersListProps) => {
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
              className="flex flex-col gap-4"
            >
              <div>
                <label htmlFor="email">Adresse email</label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  {...dataId('email-field')}
                  required
                  {...(validationErrors && { error: validationErrors['email']?.toString() })}
                />
              </div>
              <div className="flex gap-2 md:gap-6 flex-col md:flex-row">
                <p className="m-0">Sélectionnez un rôle : </p>
                <div className="flex gap-6">
                  <div className="flex">
                    <input
                      type="radio"
                      name="role"
                      id="acheteur-obligé"
                      value="acheteur-obligé"
                      defaultChecked
                      required
                    />
                    <label htmlFor="acheteur-obligé">Acheteur obligé</label>
                  </div>
                  <div className="flex">
                    <input type="radio" name="role" id="ademe" value="ademe" required />
                    <label htmlFor="ademe">ADEME</label>
                  </div>
                </div>
              </div>
              <Button
                className="m-auto"
                primary
                type="submit"
                id="submit"
                {...dataId('submit-button')}
              >
                Inviter
              </Button>
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
  }
)

hydrateOnClient(PartnersList)
