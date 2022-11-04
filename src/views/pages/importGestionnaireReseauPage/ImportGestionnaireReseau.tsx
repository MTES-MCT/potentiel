import React, { FC, useState } from 'react'
import {
  Badge,
  Input,
  Label,
  Button,
  PageTemplate,
  SuccessErrorBox,
  Tile,
  ErrorIcon,
  SuccessIcon,
  Link,
  SecondaryLinkButton,
  RefreshIcon,
  SuccessBox,
} from '@components'
import routes from '@routes'
import { Request } from 'express'
import { hydrateOnClient } from '@views/helpers'

type ErreurValidationCsv = {
  numéroLigne?: number
  valeurInvalide?: string
  raison: string
}

type RésultatErreurs = Array<{
  raison: string
  projetId?: string
  identifiantGestionnaireRéseau: string
}>

const RapportErreurs: FC<{ erreurs: RésultatErreurs }> = ({ erreurs }) => (
  <ul className="p-0 list-none">
    {erreurs.map((erreur, index) => {
      return (
        <li className="mt-3 text-sm">
          <span className="block">
            Identifiant gestionnaire réseau :
            <code className="font-bold">{erreur.identifiantGestionnaireRéseau}</code>
          </span>
          <span className="block">Erreur : {erreur.raison}</span>
          {erreur.projetId && (
            <Link className="block" href={routes.PROJECT_DETAILS(erreur.projetId)}>
              Voir page projet
            </Link>
          )}
          {index !== erreurs.length - 1 && (
            <hr
              style={{ borderTopWidth: '1px', borderTopStyle: 'solid' }}
              className="my-4 border-t-grey-925-base"
            />
          )}
        </li>
      )
    })}
  </ul>
)

type TâcheProps = {
  type: 'maj-date-mise-en-service'
  dateDeDébut: Date
} & (
  | {
      état: 'en cours'
    }
  | {
      état: 'terminée'
      dateDeFin: Date
      nombreDeSucces: number
      nombreDEchecs: number
      résultatErreurs: RésultatErreurs
    }
)
const Tâche: FC<TâcheProps> = (props) => {
  const { état, dateDeDébut } = props
  const [afficherDétailErreurs, setAfficherDétailErreurs] = useState(false)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1">
          <p className="font-bold m-0 p-0">Mise à jour de dates de mise en service</p>
          <Badge className="" type={état === 'en cours' ? 'info' : 'success'}>
            {état}
          </Badge>
        </div>
        <p className="m-0 p-0 text-sm text-grey-625-base">
          {état === 'en cours' && `Démarrée le ${new Date(dateDeDébut).toLocaleString()}`}
          {état === 'terminée' && `Terminée le ${new Date(props.dateDeFin).toLocaleString()}`}
        </p>
      </div>
      {état === 'terminée' && (
        <>
          <div className="flex flex-col lg:flex-row gap-1">
            {props.nombreDeSucces > 0 && (
              <div className="flex items-center text-sm lg:mr-4">
                <SuccessIcon className="w-4 h-4 text-success-425-base mr-1" />
                {`${props.nombreDeSucces} ${
                  props.nombreDeSucces === 1 ? 'projet a' : 'projets ont'
                } été mis à jour`}
              </div>
            )}
            {props.nombreDEchecs > 0 && (
              <Link
                className="flex items-center text-sm"
                onClick={() => {
                  setAfficherDétailErreurs(!afficherDétailErreurs)
                }}
              >
                <ErrorIcon className="w-4 h-4 text-error-425-base mr-1" />
                {`${props.nombreDEchecs} ${
                  props.nombreDEchecs === 1 ? 'mise à jour a' : 'mises à jour ont'
                } échoué`}{' '}
                ({afficherDétailErreurs ? 'masquer le détail' : 'voir le détail'})
              </Link>
            )}
          </div>
          {afficherDétailErreurs && <RapportErreurs erreurs={props.résultatErreurs} />}
        </>
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
      return (
        <SuccessBox title="L'import du fichier a démarré. Actualisez la page pour afficher son état." />
      )
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
const CsvValidationErrorBox: FC<CsvValidationErrorBoxProps> = ({ erreursDeValidationCsv }) => {
  const afficherErreur = ({ numéroLigne, valeurInvalide, raison }: ErreurValidationCsv) => {
    return `${numéroLigne ? `Ligne ${numéroLigne.toString()} - ` : ''}${
      valeurInvalide ? `${valeurInvalide} - ` : ''
    }${raison}`
  }

  if (erreursDeValidationCsv.length === 1) {
    return <div className="notification error">{afficherErreur(erreursDeValidationCsv[0])}</div>
  }

  return (
    <ul className="notification error">
      {erreursDeValidationCsv.map((erreur, index) => (
        <li key={index} className="ml-3">
          {afficherErreur(erreur)}
        </li>
      ))}
    </ul>
  )
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
