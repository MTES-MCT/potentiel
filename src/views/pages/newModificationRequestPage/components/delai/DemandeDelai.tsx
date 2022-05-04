import { Project } from '@entities'
import moment from 'moment'
import React, { useState } from 'react'
import { dataId } from '../../../../../helpers/testId'
import { formatDate } from '../../../../../helpers/formatDate'
import { add, format } from 'date-fns'

type DemandeDelaiProps = {
  project: Project
  delayInMonths: number
  justification: string
}

moment.locale('fr')

export const DemandeDelai = ({ project, delayInMonths, justification }: DemandeDelaiProps) => {
  const [delayInMonthsValue, changeDelayInMonths] = useState(delayInMonths)
  return (
    <>
      <label>Date théorique de mise en service</label>
      <input
        type="text"
        disabled
        defaultValue={formatDate(project.completionDueOn)}
        {...dataId('modificationRequest-presentServiceDateField')}
      />
      <label style={{ marginTop: 5 }} className="required" htmlFor="delayInMonths">
        Durée du délai en mois
      </label>
      <input
        type="number"
        name="delayInMonths"
        id="delayInMonths"
        defaultValue={delayInMonths}
        onChange={(e) => changeDelayInMonths(e.target.valueAsNumber)}
      />
      {delayInMonthsValue && (
        <div style={{ fontSize: 11 }}>
          Date de mise en service projetée :{' '}
          {format(add(project.completionDueOn, { months: delayInMonthsValue }), 'dd/MM/yyyy')}
        </div>
      )}

      <label style={{ marginTop: 10 }} className="required" htmlFor="justification">
        <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
        <br />
        Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit
        à ce besoin de modification (contexte, facteurs extérieurs, etc)
      </label>
      <textarea
        name="justification"
        id="justification"
        defaultValue={justification || ''}
        {...dataId('modificationRequest-justificationField')}
      />
      {!(project.dcrNumeroDossier || project.numeroGestionnaire) ? (
        <>
          <label htmlFor="numeroGestionnaire" style={{ marginTop: 5 }}>
            Identifiant gestionnaire de réseau
          </label>
          <div style={{ fontSize: 11 }}>
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
        </>
      ) : null}
      <label htmlFor="file" style={{ marginTop: 5 }}>
        Pièce justificative (si nécessaire)
      </label>
      <input type="file" name="file" {...dataId('modificationRequest-fileField')} id="file" />
    </>
  )
}
