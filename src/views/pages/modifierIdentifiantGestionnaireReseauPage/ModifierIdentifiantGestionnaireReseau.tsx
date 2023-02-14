import React from 'react'
import { Request } from 'express'

import {
  Button,
  ErrorBox,
  Heading1,
  Heading2,
  Input,
  Label,
  PageTemplate,
  ProjectInfo,
  SecondaryLinkButton,
  SuccessBox,
} from '@components'
import { hydrateOnClient } from '../../helpers'
import routes from '@routes'

type ModifierIdentifiantGestionnaireReseauProps = {
  request: Request
  projet: {
    id: string
    nomProjet: string
    nomCandidat: string
    communeProjet: string
    regionProjet: string
    departementProjet: string
    periodeId: string
    familleId: string
    notifiedOn: number
    appelOffreId: string
    numeroGestionnaire?: string
  }
}

export const ModifierIdentifiantGestionnaireReseau = ({
  request,
  projet,
}: ModifierIdentifiantGestionnaireReseauProps) => {
  const { error, success } = (request.query as any) || {}
  return (
    <PageTemplate user={request.user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>
            {projet.numeroGestionnaire
              ? "Je modifie l'identifiant du numéro gestionnaire réseau"
              : "J'ajoute un numéro de gestionnaire réseau"}
          </Heading1>
        </div>

        <form
          action={routes.POST_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU}
          method="post"
          className="flex flex-col gap-5"
        >
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
          <div>
            <Heading2>Concernant le projet</Heading2>
            <ProjectInfo project={projet} className="mb-3" />
          </div>

          <input type="hidden" name="projetId" value={projet.id} />
          <div>
            <Label htmlFor="identifiantGestionnaireRéseau">
              {projet.numeroGestionnaire ? "Remplacer l'identifiant" : "Ajouter l'identifiant"} du
              numéro de gestionnaire (champ obligatoire)
            </Label>
            <Input
              type="text"
              id="identifiantGestionnaireRéseau"
              name="identifiantGestionnaireRéseau"
              placeholder="Saisir un nouvel identifiant"
              required
            />
          </div>

          <div className="m-auto flex">
            <Button className="mr-1" type="submit">
              Envoyer
            </Button>
            <SecondaryLinkButton href={routes.PROJECT_DETAILS(projet.id)}>
              Annuler
            </SecondaryLinkButton>
          </div>
        </form>
      </div>
    </PageTemplate>
  )
}
hydrateOnClient(ModifierIdentifiantGestionnaireReseau)
