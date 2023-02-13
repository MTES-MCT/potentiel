import React from 'react'
import { Request } from 'express'

import { Button, Heading1, Input, PageTemplate, SecondaryLinkButton } from '@components'
import { hydrateOnClient } from '../../helpers'
import routes from '@routes'

type ModifierIdentifiantGestionnaireReseauProps = {
  request: Request
  projet: {
    id: string
    numeroGestionnaire?: string
  }
}

export const ModifierIdentifiantGestionnaireReseau = ({
  request,
  projet: { id, numeroGestionnaire },
}: ModifierIdentifiantGestionnaireReseauProps) => (
  <PageTemplate user={request.user} currentPage="list-projects">
    <div className="panel">
      <div className="panel__header">
        <Heading1>
          {numeroGestionnaire
            ? "Je modifie l'identifiant du numéro gestionnaire réseau"
            : "J'ajoute un numéro de gestionnaire réseau"}
        </Heading1>
      </div>
      <form
        action={routes.POST_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU}
        method="post"
        className="flex flex-colgap-5"
      >
        <input type="hidden" name="projetId" value={id} />

        <Input
          type="text"
          name="identifiantGestionnaireRéseau"
          placeholder={
            numeroGestionnaire
              ? `Remplacer l'identifiant : ${numeroGestionnaire}`
              : "Ajouter l'identifiant"
          }
        />

        <div className="m-auto flex">
          <Button className="mr-1" type="submit">
            Envoyer
          </Button>
          <SecondaryLinkButton href={routes.PROJECT_DETAILS(id)}>Annuler</SecondaryLinkButton>
        </div>
      </form>
    </div>
  </PageTemplate>
)

hydrateOnClient(ModifierIdentifiantGestionnaireReseau)
