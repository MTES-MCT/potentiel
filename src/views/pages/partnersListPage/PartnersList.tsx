import { Request } from 'express'
import React from 'react'
import { User } from '@entities'
import { dataId } from '../../../helpers/testId'
import ROUTES from '@routes'
import { Button, Input, PageTemplate, Select, SuccessBox, ErrorBox } from '@components'
import { hydrateOnClient } from '../../helpers'

type PartnersListProps = {
  request: Request
  users: Array<User>
  validationErrors?: Array<{ [fieldName: string]: string }>
}

export const PartnersList = ({ request, users, validationErrors }: PartnersListProps) => {
  const { error, success } = (request.query as any) || {}

  return (
    <PageTemplate user={request.user} currentPage="admin-users">
      <div className="panel">
        <div className="panel__header">
          <h1 className="text-2xl">Gérer les utilisateurs partenaires</h1>
        </div>
        <div className="panel__header">
          <h2 className="text-lg">Ajouter un utilisateur</h2>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
          <form
            action={ROUTES.ADMIN_INVITE_USER_ACTION}
            method="post"
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="email">Adresse email :</label>
              <Input
                type="email"
                name="email"
                id="email"
                {...dataId('email-field')}
                required
                {...(validationErrors && { error: validationErrors['email']?.toString() })}
              />
            </div>
            <div>
              <Select
                name="role"
                id="role"
                {...dataId('role-field')}
                required
                {...(validationErrors && { error: validationErrors['role']?.toString() })}
              >
                <option>
                  <label htmlFor="role">Sélectionnez un rôle</label>
                </option>
                <option value="acheteur-obligé">Acheteur obligé</option>
                <option value="ademe">ADEME</option>
                <option value="cre">CRE</option>
              </Select>
            </div>
            <Button className="m-auto" type="submit" id="submit" {...dataId('submit-button')}>
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
    </PageTemplate>
  )
}

hydrateOnClient(PartnersList)
