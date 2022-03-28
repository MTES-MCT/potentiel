import React, { useState } from 'react'
import { Project } from '@entities'
import ROUTES from '../../../routes'
import { dataId } from '../../../helpers/testId'
import UserDashboard from '../../components/UserDashboard'
import { Request } from 'express'
import { formatDate } from '../../../helpers/formatDate'
import { PageLayout } from '../../components/PageLayout'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'
import ModificationRequestActionTitles from '../../components/ModificationRequestActionTitles'
import { CDCChoiceForm } from '../../components/CDCChoiceForm'
import {
  DemandeAbandon,
  ChangementActionnaire,
  ChangementFournisseur,
  ChangementProducteur,
  ChangementPuissance,
  DemandeRecours,
  DemandeDelai,
} from './components'

type NewModificationRequestProps = {
  request: Request
  project: Project
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const NewModificationRequest = PageLayout(
  ({ request, project, cahiersChargesURLs }: NewModificationRequestProps) => {
    const { action, error, success, puissance, actionnaire, justification, delayInMonths } =
      (request.query as any) || {}

    const [displayForm, setDisplayForm] = useState(project.newRulesOptIn)
    const [isSubmitButtonDisabled, setDisableSubmitButton] = useState(false)
    const isEolien = project.appelOffre?.type === 'eolien'

    return (
      <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header">
            <h3>
              <ModificationRequestActionTitles action={action} />
            </h3>
          </div>

          <form action={ROUTES.DEMANDE_ACTION} method="post" encType="multipart/form-data">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="type" value={action} />
            <div className="form__group">
              <div style={{ marginBottom: 5 }}>Concernant le projet:</div>
              <div
                className="text-quote"
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  marginBottom: 10,
                }}
              >
                <div {...dataId('modificationRequest-item-nomProjet')}>{project.nomProjet}</div>
                <div
                  style={{
                    fontStyle: 'italic',
                    lineHeight: 'normal',
                    fontSize: 12,
                  }}
                >
                  <div {...dataId('modificationRequest-item-nomCandidat')}>
                    {project.nomCandidat}
                  </div>
                  <span {...dataId('modificationRequest-item-communeProjet')}>
                    {project.communeProjet}
                  </span>
                  ,{' '}
                  <span {...dataId('modificationRequest-item-departementProjet')}>
                    {project.departementProjet}
                  </span>
                  ,{' '}
                  <span {...dataId('modificationRequest-item-regionProjet')}>
                    {project.regionProjet}
                  </span>
                </div>
                <div {...dataId('modificationRequest-item-puissance')}>
                  {project.puissance} {project.appelOffre?.unitePuissance}
                </div>
                <div>
                  Désigné le{' '}
                  <span {...dataId('modificationRequest-item-designationDate')}>
                    {formatDate(project.notifiedOn, 'DD/MM/YYYY')}
                  </span>{' '}
                  pour la période{' '}
                  <span {...dataId('modificationRequest-item-periode')}>{project.periodeId}</span>{' '}
                  <span {...dataId('modificationRequest-item-famille')}>{project.familleId}</span>
                </div>
              </div>
              {error && (
                <div className="notification error" {...dataId('modificationRequest-errorMessage')}>
                  {error}
                </div>
              )}
              {success && (
                <div
                  className="notification success"
                  {...dataId('modificationRequest-successMessage')}
                >
                  {success}
                </div>
              )}
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
                  {action === 'puissance' && (
                    <ChangementPuissance
                      {...{
                        project,
                        puissance,
                        justification,
                        onPuissanceChecked: (isValid) => setDisableSubmitButton(!isValid),
                      }}
                    />
                  )}
                  {action === 'fournisseur' && (
                    <ChangementFournisseur {...{ project, justification }} />
                  )}
                  {action === 'producteur' && (
                    <ChangementProducteur {...{ project, justification }} />
                  )}
                  {action === 'actionnaire' && (
                    <ChangementActionnaire {...{ project, actionnaire, justification }} />
                  )}
                  {action === 'abandon' && <DemandeAbandon {...{ justification }} />}
                  {action === 'recours' && <DemandeRecours {...{ justification }} />}
                  {action === 'delai' && (
                    <DemandeDelai {...{ project, delayInMonths, justification }} />
                  )}

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
                    href={ROUTES.USER_LIST_PROJECTS}
                  >
                    Annuler
                  </a>
                </div>
              )}
            </div>
          </form>
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(NewModificationRequest)
