import { Badge, SuccessIcon, ErrorIcon, Link } from '@components'
import routes from '@routes'
import React, { FC, useState } from 'react'

export type TâcheProps = {
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

export const Tâche: FC<TâcheProps> = (props) => {
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
