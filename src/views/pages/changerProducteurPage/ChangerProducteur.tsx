import React, { useState } from 'react'
import { Project } from '@entities'
import ROUTES from '@routes'
import { dataId } from '../../../helpers/testId'
import { Request } from 'express'

import {
  PageLayout,
  CDCChoiceForm,
  UserDashboard,
  ProjectInfo,
  SuccessErrorBox,
  Button,
  FormulaireChampsObligatoireLégende,
  Label,
  SecondaryLinkButton,
  Astérisque,
  Input,
  TextArea,
} from '@components'
import { hydrateOnClient } from '../../helpers'

type ChangerProducteurProps = {
  request: Request
  project: Project
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ChangerProducteur = PageLayout(
  ({ request, project, cahiersChargesURLs }: ChangerProducteurProps) => {
    const { error, success, justification } = (request.query as any) || {}

    const { appelOffre } = project
    const isEolien = appelOffre?.type === 'eolien'

    const doitChoisirCahierDesCharges =
      project.appelOffre?.choisirNouveauCahierDesCharges && !project.newRulesOptIn
    const [newRulesOptInSelectionné, setNewRulesOptInSelectionné] = useState(project.newRulesOptIn)

    return (
      <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header">
            <h3>Je signale un changement de producteur</h3>
          </div>

          <form
            action={ROUTES.CHANGEMENT_PRODUCTEUR_ACTION}
            method="post"
            encType="multipart/form-data"
          >
            <input type="hidden" name="projetId" value={project.id} />
            <FormulaireChampsObligatoireLégende className="text-right" />
            <div className="form__group">
              <div className="mb-2">Concernant le projet:</div>
              <ProjectInfo project={project} className="mb-3"></ProjectInfo>
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
                    onChoiceChange={(isNewRule: boolean) => setNewRulesOptInSelectionné(isNewRule)}
                  />
                </div>
              )}

              {(newRulesOptInSelectionné || !doitChoisirCahierDesCharges) && (
                <div {...dataId('modificationRequest-demandesInputs')}>
                  {isEolien && (
                    <div className="notification error my-4">
                      <span>
                        Vous ne pouvez pas changer de producteur avant la date d'achèvement de ce
                        projet.
                      </span>
                    </div>
                  )}
                  <label>Ancien producteur</label>
                  <Input
                    type="text"
                    disabled
                    defaultValue={project.nomCandidat}
                    style={{ backgroundColor: '#CECECE' }}
                  />
                  {!isEolien && appelOffre?.isSoumisAuxGF && (
                    <div className="notification warning my-4">
                      <span>
                        Attention : de nouvelles garanties financières devront être déposées d'ici
                        un mois
                      </span>
                    </div>
                  )}
                  <label htmlFor="producteur" className="mt-4 ">
                    Nouveau producteur <Astérisque />
                  </label>
                  <Input
                    type="text"
                    name="producteur"
                    id="producteur"
                    {...dataId('modificationRequest-producteurField')}
                    required
                    {...(isEolien && { disabled: true })}
                  />
                  <label htmlFor="email" className="mt-4 ">
                    Adresse email du nouveau producteur
                  </label>
                  <p className="m-0 italic">
                    Le nouveau producteur recevra une invitation sur sa boite mail pour accéder au
                    projet sur Potentiel.
                  </p>
                  <Input
                    type="text"
                    name="email"
                    id="email"
                    {...dataId('modificationRequest-producteurField')}
                    {...(isEolien && { disabled: true })}
                  />
                  <label htmlFor="candidats" className="mt-4 ">
                    Statuts mis à jour
                  </label>
                  <Input
                    type="file"
                    name="file"
                    {...dataId('modificationRequest-fileField')}
                    id="file"
                    {...(isEolien && { disabled: true })}
                  />
                  <Label htmlFor="justification" className="mt-4">
                    Veuillez nous indiquer les raisons qui motivent votre demande
                    <br />
                    <span className="italic">
                      Pour faciliter le traitement de votre demande, veillez à détailler les raisons
                      ayant conduit à ce besoin de modification (contexte, facteurs extérieurs,
                      etc).
                    </span>
                  </Label>
                  <TextArea
                    name="justification"
                    id="justification"
                    defaultValue={justification || ''}
                    {...dataId('modificationRequest-justificationField')}
                    {...(isEolien && { disabled: true })}
                  />

                  <Button
                    className="mt-3 mr-1"
                    type="submit"
                    id="submit"
                    {...dataId('submit-button')}
                  >
                    Envoyer
                  </Button>
                  <SecondaryLinkButton href={ROUTES.USER_LIST_PROJECTS}>
                    Annuler
                  </SecondaryLinkButton>
                </div>
              )}
            </div>
          </form>
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(ChangerProducteur)
