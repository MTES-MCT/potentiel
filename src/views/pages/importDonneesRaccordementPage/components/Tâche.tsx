import { Badge, SuccessIcon, ErrorIcon, Link, SkipIcon } from '@components'
import routes from '@routes'
import React, { FC, useState } from 'react'

export type TâcheProps = {
  type: 'maj-données-de-raccordement'
  dateDeDébut: Date
} & (
  | {
      état: 'en cours'
    }
  | {
      état: 'terminée'
      dateDeFin: Date
      détail: Détail
    }
)

type Succès = {
  projetId: string
  identifiantGestionnaireRéseau: string
}

type Erreur = {
  raison: string
  projetId?: string
  identifiantGestionnaireRéseau: string
}

type Ignorés = {
  raison: string
  projetId: string
  identifiantGestionnaireRéseau: string
}

type Détail = {
  succès?: Array<Succès>
  ignorés?: Array<Ignorés>
  erreurs?: Array<Erreur>
}

export const Tâche: FC<TâcheProps> = (props) => {
  const { état, dateDeDébut } = props
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1">
          <p className="font-bold m-0 p-0">Mise à jour des données de raccordement</p>
          <Badge className="" type={état === 'en cours' ? 'info' : 'success'}>
            {état}
          </Badge>
        </div>
        <p className="m-0 p-0 text-sm text-grey-625-base">
          {état === 'en cours' && `Démarrée le ${new Date(dateDeDébut).toLocaleString()}`}
          {état === 'terminée' && `Terminée le ${new Date(props.dateDeFin).toLocaleString()}`}
        </p>
      </div>
      {props.état === 'terminée' && (
        <div className="flex flex-col lg:flex-row gap-1">
          {props.détail.succès && (
            <div>
              <DétailSuccès {...{ succès: props.détail.succès }} />
            </div>
          )}
          {props.détail.ignorés && (
            <div>
              <DétailIgnorés {...{ ignorés: props.détail.ignorés }} />
            </div>
          )}
          {props.détail.erreurs && (
            <div>
              <DétailErreurs {...{ erreurs: props.détail.erreurs }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const DétailSuccès: FC<{ succès: Array<Succès> }> = ({ succès }) => {
  return succès.length > 0 ? (
    <div className="flex items-center text-sm lg:mr-4">
      <SuccessIcon className="w-4 h-4 text-success-425-base mr-1" />
      {`${succès.length} ${succès.length === 1 ? 'projet a' : 'projets ont'} été mis à jour`}
    </div>
  ) : null
}

const DétailIgnorés: FC<{ ignorés: Array<Ignorés> }> = ({ ignorés }) => {
  const [afficherDétail, setAfficherDétail] = useState(false)

  return ignorés.length > 0 ? (
    <>
      <Link
        className="flex items-center text-sm lg:mr-4"
        onClick={() => {
          setAfficherDétail(!afficherDétail)
        }}
      >
        <SkipIcon className="w-4 h-4 text-grey-625-base mr-1" />
        {`${ignorés.length} ${
          ignorés.length === 1 ? 'mise à jour a été ignorée' : 'mises à jour ont été ignorées'
        } (${afficherDétail ? 'masquer le détail' : 'voir le détail'})`}
      </Link>
      {afficherDétail && (
        <ul className="p-0 list-none">
          {ignorés.map((ignorés, index) => {
            return (
              <li
                key={`skip-${index}`}
                className="py-3 text-sm border-0 border-solid border-b-grey-925-base border-b-[1px] last:border-b-0"
              >
                <div>
                  Identifiant gestionnaire réseau :
                  <code className="font-bold">{ignorés.identifiantGestionnaireRéseau}</code>
                </div>
                <div>Raison : {ignorés.raison}</div>
                {ignorés.projetId && (
                  <Link className="block" href={routes.PROJECT_DETAILS(ignorés.projetId)}>
                    Voir page projet
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  ) : null
}

const DétailErreurs: FC<{ erreurs: Array<Erreur> }> = ({ erreurs }) => {
  const [afficherDétail, setAfficherDétail] = useState(false)

  return erreurs.length > 0 ? (
    <>
      <Link
        className="flex items-center text-sm"
        onClick={() => {
          setAfficherDétail(!afficherDétail)
        }}
      >
        <ErrorIcon className="w-4 h-4 text-error-425-base mr-1" />
        {`${erreurs.length} ${
          erreurs.length === 1 ? 'mise à jour a' : 'mises à jour ont'
        } échoué (${afficherDétail ? 'masquer le détail' : 'voir le détail'})`}
      </Link>
      {afficherDétail && (
        <ul className="p-0 list-none">
          {erreurs.map((erreur, index) => {
            return (
              <li
                key={`error-${index}`}
                className="py-3 text-sm border-0 border-solid border-b-grey-925-base border-b-[1px] last:border-b-0"
              >
                <div>
                  Identifiant gestionnaire réseau :
                  <code className="font-bold">{erreur.identifiantGestionnaireRéseau}</code>
                </div>
                <div>Erreur : {erreur.raison}</div>
                {erreur.projetId && (
                  <Link className="block" href={routes.PROJECT_DETAILS(erreur.projetId)}>
                    Voir page projet
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  ) : null
}
