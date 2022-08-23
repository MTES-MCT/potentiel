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
  FormulaireChampsObligatoireLégende,
  Label,
} from '@components'
import { hydrateOnClient } from '../../helpers'

type DemanderAbandonProps = {
  request: Request
  project: Project
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const DemanderAbandon = PageLayout(
  ({ request, project, cahiersChargesURLs }: DemanderAbandonProps) => {
    const { action, error, success, justification } = (request.query as any) || {}

    const doitChoisirCahierDesCharges =
      project.appelOffre?.choisirNouveauCahierDesCharges && !project.newRulesOptIn
    const [newRulesOptInSelectionné, setNewRulesOptInSelectionné] = useState(project.newRulesOptIn)

    return (
      <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header">
            <h3>
              <ModificationRequestActionTitles action={action} />
            </h3>
          </div>

          <form action={ROUTES.DEMANDE_ABANDON_ACTION} method="post" encType="multipart/form-data">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="type" value={action} />
            {action !== 'fournisseur' && (
              <FormulaireChampsObligatoireLégende className="text-right" />
            )}
            <div className="form__group">
              <div className="mb-2">Concernant le projet:</div>
              <ProjectInfo project={project} className="mb-3" />
              <SuccessErrorBox success={success} error={error} />
              {doitChoisirCahierDesCharges && (
                <div>
                  <Label required>
                    <strong>
                      Veuillez saisir les modalités d'instruction à appliquer à ce changement
                    </strong>
                  </Label>
                  <CDCChoiceForm
                    newRulesOptIn={project.newRulesOptIn}
                    cahiersChargesURLs={cahiersChargesURLs}
                    onChoiceChange={(isNewRule: boolean) => setNewRulesOptInSelectionné(!isNewRule)}
                  />
                </div>
              )}

              {(newRulesOptInSelectionné || !doitChoisirCahierDesCharges) && (
                <div {...dataId('modificationRequest-demandesInputs')}>
                  <Label htmlFor="justification">
                    <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
                    <br />
                    Pour faciliter le traitement de votre demande, veillez à détailler les raisons
                    ayant conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
                  </Label>
                  <textarea
                    name="justification"
                    id="justification"
                    defaultValue={justification || ''}
                    {...dataId('modificationRequest-justificationField')}
                  />
                  <label htmlFor="candidats">Pièce justificative</label>
                  <input
                    type="file"
                    name="file"
                    {...dataId('modificationRequest-fileField')}
                    id="file"
                  />
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

hydrateOnClient(DemanderAbandon)
