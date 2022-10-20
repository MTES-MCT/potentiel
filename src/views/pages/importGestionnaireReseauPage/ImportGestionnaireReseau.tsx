import React, { FC } from 'react'
import {
  Badge,
  Input,
  Label,
  AdminDashboard,
  Button,
  PageTemplate,
  SuccessErrorBox,
  Tile,
  ErrorIcon,
  SuccessIcon,
} from '@components'
import routes from '@routes'
import { Request } from 'express'
import { format } from 'date-fns'

type ErreurValidationCsv = {
  numéroLigne: number
  valeurInvalide?: string
  raison: string
}

type TâcheProps = {
  id: string
  type: 'maj-date-mise-en-service'
  date: Date
} & (
  | {
      état: 'en cours'
    }
  | {
      état: 'terminée'
      résultat: {
        succès: number
        échec: number
      }
    }
)

const Tâche: FC<TâcheProps> = (props) => {
  const { état, date } = props
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1">
          <p className="font-bold m-0 p-0">Mise à jour de dates de mise en service</p>
          <Badge className="" type={état === 'en cours' ? 'info' : 'success'}>
            {état}
          </Badge>
        </div>
        <p className="m-0 p-0 text-sm text-grey-625-base">Démarrée le {format(date, 'P à p')}</p>
      </div>
      {état === 'terminée' && (
        <div className="flex flex-col lg:flex-row gap-1">
          {props.résultat.succès > 0 && (
            <div className="flex items-center text-sm lg:mr-4">
              <SuccessIcon className="w-4 h-4 text-success-425-base mr-1" />
              {props.résultat.succès} projets ont été mis à jour
            </div>
          )}
          {props.résultat.échec > 0 && (
            <div className="flex items-center text-sm">
              <ErrorIcon className="w-4 h-4 text-error-425-base mr-1" />
              {props.résultat.échec} mises à jour ont échouées
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type ImportGestionnaireReseauProps = {
  request: Request
  tâches: Array<TâcheProps>
  résultatSoumissionFormulaire?: RésultatSoumissionFormulaireProps['résultatSoumissionFormulaire']
}

type RésultatSoumissionFormulaireProps = {
  résultatSoumissionFormulaire:
    | {
        type: 'succès'
      }
    | {
        type: 'échec'
        raison: string
        erreursDeValidationCsv?: Array<ErreurValidationCsv>
      }
}

const RésultatSoumissionFormulaire: FC<RésultatSoumissionFormulaireProps> = ({
  résultatSoumissionFormulaire,
}) => {
  switch (résultatSoumissionFormulaire.type) {
    case 'succès':
      return <SuccessErrorBox success="L'import du fichier a démarré." />
    case 'échec':
      return résultatSoumissionFormulaire.erreursDeValidationCsv &&
        résultatSoumissionFormulaire.erreursDeValidationCsv?.length > 0 ? (
        <CsvValidationErrorBox
          erreursDeValidationCsv={résultatSoumissionFormulaire.erreursDeValidationCsv}
        />
      ) : (
        <SuccessErrorBox error={résultatSoumissionFormulaire.raison} />
      )
  }
}

type CsvValidationErrorBoxProps = {
  erreursDeValidationCsv: Array<ErreurValidationCsv>
}
const CsvValidationErrorBox: FC<CsvValidationErrorBoxProps> = ({ erreursDeValidationCsv }) => (
  <ul className="notification error">
    {erreursDeValidationCsv.map(({ numéroLigne, valeurInvalide, raison }, index) => (
      <li key={index} className="ml-3">
        {numéroLigne && `Ligne ${numéroLigne.toString()} - `}
        {valeurInvalide && `${valeurInvalide} - `}
        {raison && `${raison}`}
      </li>
    ))}
  </ul>
)

export const ImportGestionnaireReseau = ({
  request,
  tâches,
  résultatSoumissionFormulaire,
}: ImportGestionnaireReseauProps) => (
  <PageTemplate user={request.user}>
    <AdminDashboard currentPage="import-gestionnaire-réseau" role="admin">
      <div className="panel p-4">
        <h3 className="section--title">Import gestionnaire réseau</h3>
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
      <div className="panel">
        <h4>Liste des mises à jour :</h4>

        {tâches.length === 0 && (
          <div className="flex p-16 border border-dashed border-grey-625-base">
            <span className="mx-auto text-center">Aucune mise à jour n'a encore été démarrée</span>
          </div>
        )}

        <ul className="m-0 p-0 list-none">
          {tâches.map((tâche) => (
            <li key={tâche.id} className="m-0 mb-3 p-0">
              <Tile>
                <Tâche {...tâche} />
              </Tile>
            </li>
          ))}
        </ul>
      </div>
    </AdminDashboard>
  </PageTemplate>
)
