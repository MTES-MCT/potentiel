import React from 'react'
import {
  Input,
  Label,
  Button,
  PageTemplate,
  Tile,
  SecondaryLinkButton,
  RefreshIcon,
} from '@components'
import routes from '@routes'
import { Request } from 'express'
import { hydrateOnClient } from '@views/helpers'

import {
  RésultatSoumissionFormulaire,
  RésultatSoumissionFormulaireProps,
} from './components/RésultatSoumissionFormulaire'
import { Tâche, TâcheProps } from './components/Tâche'

type ImportGestionnaireReseauProps = {
  request: Request
  tâches: Array<TâcheProps>
  résultatSoumissionFormulaire?: RésultatSoumissionFormulaireProps['résultatSoumissionFormulaire']
}

export const ImportGestionnaireReseau = ({
  request,
  tâches,
  résultatSoumissionFormulaire,
}: ImportGestionnaireReseauProps) => (
  <PageTemplate user={request.user} currentPage="import-gestionnaire-réseau">
    <div className="panel">
      <div className="panel__header">
        <h1 className="text-2xl">Import des données de raccordement</h1>
      </div>
      {résultatSoumissionFormulaire && (
        <RésultatSoumissionFormulaire {...{ résultatSoumissionFormulaire }} />
      )}
      <form
        action={routes.POST_DEMARRER_IMPORT_GESTIONNAIRE_RESEAU}
        method="post"
        encType="multipart/form-data"
      >
        <Label htmlFor="fichier">Fichier .csv du gestionnaire de réseau :</Label>
        <Input type="file" required name="fichier-import-gestionnaire-réseau" id="fichier" />
        <Button type="submit" className="mt-4">
          Mettre les projets à jour
        </Button>
      </form>
    </div>
    <div className="panel flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="m-0 p-0">Liste des mises à jour :</h4>
        <SecondaryLinkButton href={request.path}>
          <RefreshIcon className="h-4 w-4 mr-2" /> Actualiser
        </SecondaryLinkButton>
      </div>
      {tâches.length === 0 ? (
        <div className="flex p-16 border border-dashed border-grey-625-base">
          <span className="mx-auto text-center">Aucune mise à jour n'a encore été démarrée</span>
        </div>
      ) : (
        <ul className="m-0 p-0 list-none">
          {tâches.map((tâche, index) => (
            <li key={`tâche-${index}`} className="m-0 mb-3 p-0">
              <Tile>
                <Tâche {...tâche} />
              </Tile>
            </li>
          ))}
        </ul>
      )}
    </div>
  </PageTemplate>
)

hydrateOnClient(ImportGestionnaireReseau)
