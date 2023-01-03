import React from 'react'
import { Request } from 'express'
import routes from '@routes'
import {
  Button,
  Input,
  PageTemplate,
  RésultatSoumissionFormulaire,
  RésultatSoumissionFormulaireProps,
} from '@components'
import { hydrateOnClient } from '../../helpers'
import { dataId } from '../../../helpers/testId'

type InviterDgecValidateurProps = {
  request: Request
  résultatSoumissionFormulaire?: RésultatSoumissionFormulaireProps['résultatSoumissionFormulaire']
}

export const InviterDgecValidateur = ({
  request,
  résultatSoumissionFormulaire,
}: InviterDgecValidateurProps) => {
  return (
    <PageTemplate user={request.user} currentPage="inviter-dgec-validateur">
      <div className="panel">
        <div className="panel__header">
          <h1 className="text-2xl">Gérer les DGEC-VALIDATEUR</h1>
        </div>
        <div className="panel__header">
          <h2 className="text-lg">Ajouter un utilisateur DGEC-VALIDATEUR</h2>
          {résultatSoumissionFormulaire && (
            <RésultatSoumissionFormulaire {...{ résultatSoumissionFormulaire }} />
          )}
          <form
            action={routes.ADMIN_INVITATION_DGEC_VALIDATEUR_ACTION}
            method="post"
            className="flex flex-col gap-4"
          >
            <p className="text-sm italic">Tous les champs sont obligatoires</p>
            <input type="hidden" name="role" value="dgec-validateur" />
            <div>
              <label htmlFor="email">Adresse email :</label>
              <Input
                type="email"
                name="email"
                id="email"
                {...dataId('email-field')}
                required
                className="mb-2"
              />
              <label htmlFor="fonction">Fonction :</label>
              <Input type="text" name="fonction" id="fonction" required />
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
