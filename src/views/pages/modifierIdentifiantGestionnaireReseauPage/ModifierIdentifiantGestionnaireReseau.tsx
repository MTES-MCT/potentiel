import React from 'react'
import { Request } from 'express'

import { Button, Heading1, Input, Label, PageTemplate, SecondaryLinkButton } from '@components'
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
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="projetId" value={id} />
        {numeroGestionnaire && (
          <p className="m-0">Identifiant du gestionnaire réseau actuel : {numeroGestionnaire}</p>
        )}
        <div>
          <Label required htmlFor="identifiantGestionnaireRéseau">
            {numeroGestionnaire ? "Remplacer l'identifiant" : "Ajouter l'identifiant"}
          </Label>
          <Input
            type="text"
            id="identifiantGestionnaireRéseau"
            name="identifiantGestionnaireRéseau"
            placeholder="Saisir un nouvel identifiant"
          />
        </div>

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
