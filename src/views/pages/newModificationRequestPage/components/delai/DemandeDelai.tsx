import { Project } from '@entities'
import moment from 'moment'
import React from 'react'
import { dataId } from '../../../../../helpers/testId'
import { formatDate } from '../../../../../helpers/formatDate'
import { getDelaiDeRealisation } from '@modules/projectAppelOffre'

type DemandeDelaiProps = {
  project: Project
  delayInMonths: number
  justification: string
}

export const DemandeDelai = ({ project, delayInMonths, justification }: DemandeDelaiProps) => (
  <>
    <label>Date théorique de mise en service</label>
    <input
      type="text"
      disabled
      defaultValue={formatDate(
        +moment(project.notifiedOn)
          .add(
            project.appelOffre && getDelaiDeRealisation(project.appelOffre, project.technologie),
            'months'
          )
          .subtract(1, 'day'),
        'DD/MM/YYYY'
      )}
      {...dataId('modificationRequest-presentServiceDateField')}
    />
    <label style={{ marginTop: 5 }} className="required" htmlFor="delayedServiceDate">
      Durée du délai en mois
    </label>
    <input
      type="number"
      name="delayInMonths"
      id="delayInMonths"
      defaultValue={delayInMonths}
      data-initial-date={moment(project.notifiedOn)
        .add(
          project.appelOffre && getDelaiDeRealisation(project.appelOffre, project.technologie),
          'months'
        )
        .toDate()
        .getTime()}
      {...dataId('delayInMonthsField')}
    />
    <div style={{ fontSize: 11 }} {...dataId('delayEstimateBox')}></div>
    <label style={{ marginTop: 10 }} className="required" htmlFor="justification">
      <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
      <br />
      Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant conduit à
      ce besoin de modification (contexte, facteurs extérieurs, etc)
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
