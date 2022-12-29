import React from 'react'
import { Request } from 'express'
import routes from '@routes'
import { Button, ErrorBox, Input, PageTemplate, SuccessBox } from '@components'
import { hydrateOnClient } from '../../helpers'
import { dataId } from '../../../helpers/testId'

type InviterDgecValidateurProps = {
  request: Request
  validationErrors?: Array<{ [fieldName: string]: string }>
}

export const InviterDgecValidateur = ({
  request,
  validationErrors,
}: InviterDgecValidateurProps) => {
  const { error, success } = request.query as any
  console.log(validationErrors)
  return (
    <PageTemplate user={request.user} currentPage="inviter-dgec-validateur">
      <div className="panel">
        <div className="panel__header">
          <h1 className="text-2xl">Gérer les DGEC-VALIDATEUR</h1>
        </div>
        <div className="panel__header">
          <h2 className="text-lg">Ajouter un utilisateur DGEC-VALIDATEUR</h2>
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
          <form
            action={routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION}
            method="post"
            className="flex flex-col gap-4"
          >
            <input type="hidden" name="role" value="dgec-validateur" />
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
            <Button type="submit" id="submit" {...dataId('submit-button')} className="m-auto">
              Inviter
            </Button>
          </form>
        </div>
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(InviterDgecValidateur)
