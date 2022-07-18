import {
  CDCChoiceForm,
  ModificationRequestActionTitles,
  PageLayout,
  ProjectInfo,
  SuccessErrorBox,
  TextArea,
  Astérisque,
  Input,
  UserDashboard,
} from '@components'
import routes from '@routes'

import { Project } from '@entities'

import { Request } from 'express'
import React, { useState } from 'react'
import format from 'date-fns/format'

import { dataId } from '../../../helpers/testId'
import { hydrateOnClient } from '../../helpers'

import { ProjectDataForDemanderDelaiPage } from '@modules/demandeModification'

type DemanderDelaiProps = {
  request: Request
  project: Project
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
  validationErrors?: Array<{ [fieldName: string]: string }>
}

export const DemanderDelai = PageLayout((props: DemanderDelaiProps) => {
  const {
    request: { query },
    project,
    cahiersChargesURLs,
  } = props

  const { action, error, success, puissance, actionnaire, justification, dateAchèvementDemandée } =
    (query as any) || {}

  const isEolien = project.appelOffre?.type === 'eolien'
  const [displayForm, setDisplayForm] = useState(project.newRulesOptIn)
  const [isSubmitButtonDisabled, setDisableSubmitButton] = useState(false)

  return (
    <UserDashboard currentPage={'list-requests'}>
      <h2>HELLOOOOOO</h2>
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <h3>
            <ModificationRequestActionTitles action={'delai'} />
          </h3>
        </div>
      </div>

      <form action={routes.DEMANDE_DELAI_ACTION} method="post" encType="multipart/form-data">
        <input type="hidden" name="projectId" value={project.id} />
        <input type="hidden" name="type" value={'delai'} />
        <div className="form__group">
          <div style={{ marginBottom: 5 }}>Concernant le projet:</div>
          <ProjectInfo project={project} className="mb-3" />
          <SuccessErrorBox success={success} error={error} />
          {!isEolien && (
            <div>
              <label className="required">
                <strong>
                  Veuillez saisir les modalités d'instruction à appliquer à ce changement
                </strong>
              </label>
              <CDCChoiceForm
                newRulesOptIn={project.newRulesOptIn}
                cahiersChargesURLs={cahiersChargesURLs}
                onChoiceChange={(isNewRule: boolean) => setDisplayForm(!isNewRule)}
              />
            </div>
          )}

          {(isEolien || displayForm) && (
            <div {...dataId('modificationRequest-demandesInputs')}>
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
                      Pour faciliter le traitement de votre demande, veillez à détailler les raisons
                      ayant conduit à ce besoin de modification (contexte, facteurs extérieurs,
                      etc.)
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
                  <Input
                    type="file"
                    name="file"
                    {...dataId('modificationRequest-fileField')}
                    id="file"
                  />
                </div>
              </div>

              <button
                className="button"
                type="submit"
                name="submit"
                id="submit"
                {...dataId('submit-button')}
                disabled={(isEolien && action === 'producteur') || isSubmitButtonDisabled}
              >
                Envoyer
              </button>
              <a
                className="button-outline primary"
                {...dataId('cancel-button')}
                href={routes.USER_LIST_PROJECTS}
              >
                Annuler
              </a>
            </div>
          )}
        </div>
      </form>
    </UserDashboard>
  )
})

hydrateOnClient(DemanderDelai)
