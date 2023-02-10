import React from 'react'
import { Request } from 'express'

import { Button, Heading1, Input, PageTemplate, SecondaryLinkButton } from '@components'
import { hydrateOnClient } from '../../helpers'
import routes from '@routes'

type ModifierIdentifiantGestionnaireReseauProps = {
  request: Request
  projet: {
    id: string
    numeroGestionnaire: string
  }
}

export const ModifierIdentifiantGestionnaireReseau = ({
  request,
  projet: { id, numeroGestionnaire },
}: ModifierIdentifiantGestionnaireReseauProps) => (
  <PageTemplate user={request.user} currentPage="list-projects">
    <div className="panel">
      <div className="panel__header">
        <Heading1>Je modifie l'identifiant du numéro de gestionnaire réseau</Heading1>
      </div>
      <form action={'#'} method="post" className="flex flex-col gap-5">
        <input type="hidden" name="projetId" value={id} />
        {/* {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />} */}

        <Input type="text" placeholder={`Remplacer l'identifiant : ${numeroGestionnaire}`} />

        <div className="m-auto flex">
          <Button className="mr-1" type="submit" id="submit" disabled>
            Envoyer
          </Button>
          <SecondaryLinkButton href={routes.PROJECT_DETAILS(id)}>Annuler</SecondaryLinkButton>
        </div>
      </form>
    </div>
  </PageTemplate>
)

hydrateOnClient(ModifierIdentifiantGestionnaireReseau)
