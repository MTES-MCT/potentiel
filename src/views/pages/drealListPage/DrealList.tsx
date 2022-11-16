import { Request } from 'express'
import React from 'react'
import { DREAL, REGIONS } from '../../../entities/dreal'
import { dataId } from '../../../helpers/testId'
import ROUTES from '@routes'
import { Button, ErrorBox, Input, PageTemplate, Select, SuccessBox } from '@components'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'

type DrealListProps = {
  request: Request
  users: Array<{ user: { email: string; fullName: string }; dreals: Array<DREAL> }>
  validationErrors?: Array<{ [fieldName: string]: string }>
}

export const DrealList = ({ request, users, validationErrors }: DrealListProps) => {
  const { success, error } = (request.query as any) || {}
  return (
    <PageTemplate user={request.user} currentPage="list-dreal">
      <div className="panel">
        <div className="panel__header">
          <h1 className="text-2xl">Gérer les DREAL</h1>
        </div>
        <div className="panel__header">
          <h2 className="text-lg">Ajouter un utilisateur DREAL</h2>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}

          <form
            action={ROUTES.ADMIN_INVITE_DREAL_USER_ACTION}
            method="post"
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="role" value="dreal" />
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
                name="region"
                id="region"
                {...dataId('region-field')}
                required
                {...(validationErrors && { error: validationErrors['region']?.toString() })}
              >
                <option>
                  <label htmlFor="region">Sélectionnez une région</label>
                </option>
                {[...REGIONS]
                  .sort((a, b) => a.localeCompare(b))
                  .map((value, index) => (
                    <option key={value + '_' + index} value={value}>
                      {value}
                    </option>
                  ))}
              </Select>
            </div>
            <Button type="submit" id="submit" {...dataId('submit-button')} className="m-auto">
              Inviter
            </Button>
          </form>
        </div>
        {users && users.length && (
          <>
            <h2 className="text-lg">Les utilisateurs rattachés à une DREAL</h2>
            <table className="table" {...dataId('projectList-list')}>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>DREAL(s)</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ user, dreals }, index) => {
                  return (
                    <tr key={'user_' + index} {...dataId('drealList-item')}>
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
    </PageTemplate>
  )
}

hydrateOnClient(DrealList)
