import React, { useState } from 'react'
import { Project } from '@entities'
import ROUTES from '@routes'
import { dataId } from '../../../helpers/testId'
import { Request } from 'express'

import {
  PageLayout,
  ModificationRequestActionTitles,
  CDCChoiceForm,
  UserDashboard,
  ProjectInfo,
  SuccessErrorBox,
  Button,
  Astérisque,
  FormulaireChampsObligatoireLégende,
} from '@components'
import { hydrateOnClient } from '../../helpers/hydrateOnClient'
import {
  DemandeAbandon,
  ChangementActionnaire,
  ChangementFournisseur,
  ChangementProducteur,
  ChangementPuissance,
  DemandeRecours,
} from './components'

type NewModificationRequestProps = {
  request: Request
  project: Project
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const NewModificationRequest = PageLayout(
  ({ request, project, cahiersChargesURLs }: NewModificationRequestProps) => {
    const { action, error, success, puissance, actionnaire, justification } =
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
            <FormulaireChampsObligatoireLégende className="text-right" />
            <div className="form__group">
              <div className="mb-2">Concernant le projet:</div>
              <ProjectInfo project={project} className="mb-3"></ProjectInfo>
              <SuccessErrorBox success={success} error={error} />
              {!isEolien && (
                <div>
                  <label>
                    <strong>
                      Veuillez saisir les modalités d'instruction à appliquer à ce changement{' '}
                    </strong>
                    <Astérisque />
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

                  <Button
                    primary
                    className="mt-3 mr-1"
                    type="submit"
                    id="submit"
                    {...dataId('submit-button')}
                  >
                    Envoyer
                  </Button>
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
