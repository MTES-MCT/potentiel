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

type ImportDonnéesRaccordementProps = {
  request: Request
  tâches: Array<TâcheProps>
  résultatSoumissionFormulaire?: RésultatSoumissionFormulaireProps['résultatSoumissionFormulaire']
}

export const ImportDonneesRaccordement = ({
  request,
  tâches,
  résultatSoumissionFormulaire,
}: ImportDonnéesRaccordementProps) => (
  <PageTemplate user={request.user} currentPage="import-données-raccordement">
    <div className="panel">
      <div className="panel__header">
        <h1 className="text-2xl">Import des données de raccordement</h1>
      </div>
      {résultatSoumissionFormulaire && (
        <RésultatSoumissionFormulaire {...{ résultatSoumissionFormulaire }} />
      )}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <form
          action={routes.POST_DEMARRER_IMPORT_DONNEES_RACCORDEMENT}
          method="post"
          encType="multipart/form-data"
        >
          <Label htmlFor="fichier">Fichier .csv des données de raccordement :</Label>
          <Input type="file" required name="fichier-données-raccordement" id="fichier" />
          <Button type="submit" className="mt-4">
            Mettre les projets à jour
          </Button>
        </form>
        <table className="lg:mx-4 border-spacing-0">
          <caption className="text-left">Format du fichier csv attendu</caption>
          <thead>
            <tr>
              <th
                className="bg-grey-950-base border-solid border-0 border-b-2 border-b-grey-920-base text-left p-4"
                scope="col"
              >
                Colonne
              </th>
              <th
                className="bg-grey-950-base border-solid border-0 border-b-2 border-b-grey-920-base text-left p-4"
                scope="col"
              >
                Format
              </th>
            </tr>
          </thead>
          <tbody className="bg-grey-950-base">
            <tr className="odd:bg-grey-975-base">
              <td className="text-left p-4">numeroGestionnaire</td>
              <td className="text-left p-4">chaîne de caractères</td>
            </tr>
            <tr className="odd:bg-grey-975-base">
              <td className="text-left p-4">dateMiseEnService</td>
              <td className="text-left p-4">date au format JJ/MM/AAAA</td>
            </tr>
            <tr className="odd:bg-grey-975-base">
              <td className="text-left p-4">dateFileAttente</td>
              <td className="text-left p-4">date au format JJ/MM/AAAA</td>
            </tr>
          </tbody>
        </table>
      </div>
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

hydrateOnClient(ImportDonneesRaccordement)
