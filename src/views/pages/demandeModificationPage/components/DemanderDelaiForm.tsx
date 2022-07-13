import format from 'date-fns/format'
import moment from 'moment'
import React from 'react'

import { Astérisque, Input, TextArea } from '@components'
import { Project } from '@entities'

import { dataId } from '../../../../helpers/testId'

type DemandeDelaiProps = {
  project: Project
  dateAchèvementDemandée: number
  justification: string
}

moment.locale('fr')

export const DemanderDelaiForm = ({
  project,
  dateAchèvementDemandée,
  justification,
}: DemandeDelaiProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label>Date théorique d'achèvement</label>
        <Input
          type="text"
          disabled
          defaultValue={format(project.completionDueOn, 'dd / MM / yyyy')}
          style={{ backgroundColor: '#CECECE' }}
          {...dataId('modificationRequest-presentServiceDateField')}
        />
      </div>
      <div>
        <label htmlFor="dateAchèvementDemandée">
          Saisissez la date limite d'achèvement souhaitée <Astérisque />
        </label>
        <Input
          type="date"
          name="dateAchèvementDemandée"
          id="dateAchèvementDemandée"
          min={format(project.completionDueOn, 'yyyy-MM-dd')}
          defaultValue={dateAchèvementDemandée}
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="justification">
          Veuillez nous indiquer les raisons qui motivent votre demande
          <br />
          <span className="italic">
            Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
            conduit à ce besoin de modification (contexte, facteurs extérieurs, etc.)
          </span>
        </label>
        <TextArea
          name="justification"
          id="justification"
          defaultValue={justification || ''}
          {...dataId('modificationRequest-justificationField')}
        />
      </div>
      {!(project.dcrNumeroDossier || project.numeroGestionnaire) ? (
        <div>
          <label htmlFor="numeroGestionnaire">Identifiant gestionnaire de réseau</label>
          <div className="italic">
            Cette indication permettra un traitement plus rapide de votre demande.{' '}
            <a href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-transmettre-ma-demande-complete-de-raccordement-dcr">
              Où trouver mon numéro ?
            </a>
          </div>
          <input
            type="text"
            name="numeroGestionnaire"
            {...dataId('modificationRequest-numeroGestionnaireField')}
            id="numeroGestionnaire"
          />
        </div>
      ) : null}
      <div>
        <label htmlFor="file">Pièce justificative (si nécessaire)</label>
        <Input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
      </div>
    </div>
  )
}
