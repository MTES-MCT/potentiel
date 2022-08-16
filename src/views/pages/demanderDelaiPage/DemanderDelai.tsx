import {
  CDCChoiceForm,
  PageLayout,
  ProjectInfo,
  SuccessErrorBox,
  TextArea,
  Astérisque,
  Input,
  UserDashboard,
  FormulaireChampsObligatoireLégende,
  Button,
  LinkButton,
  Label,
} from '@components'
import routes from '@routes'
import { Project } from '@entities'

import { Request } from 'express'
import React, { useState } from 'react'
import format from 'date-fns/format'

import { dataId } from '../../../helpers/testId'
import { hydrateOnClient } from '../../helpers'

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

  const { error, success, justification, dateAchèvementDemandée } = (query as any) || {}

  const doisChoisirCahierDesCharges = project.appelOffre?.choisirNouveauCahierDesCharges && !project.newRulesOptIn;
  const [newRulesOptInSelectionné, setNewRulesOptInSelectionné] = useState(project.newRulesOptIn);
  const nouvelleDateAchèvementMinimale = new Date(project.completionDueOn).setDate(
    new Date(project.completionDueOn).getDate() + 1
  )

  return (
    <UserDashboard currentPage="list-requests">
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <h3>
            <span>Je demande un délai supplémentaire</span>
          </h3>
        </div>

        <form action={routes.DEMANDE_DELAI_ACTION} method="post" encType="multipart/form-data">
          <FormulaireChampsObligatoireLégende className="text-right" />
          <input type="hidden" name="projectId" value={project.id} />
          <input type="hidden" name="type" value={'delai'} />
          <div className="form__group">
            <div className="mb-1">Concernant le projet:</div>
            <ProjectInfo project={project} className="mb-3" />
            <SuccessErrorBox success={success} error={error} />
            {doisChoisirCahierDesCharges && (
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

            {(newRulesOptInSelectionné || !doisChoisirCahierDesCharges) && (
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
                      min={format(nouvelleDateAchèvementMinimale, 'yyyy-MM-dd')}
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
                        Pour faciliter le traitement de votre demande, veillez à détailler les
                        raisons ayant conduit à ce besoin de modification (contexte, facteurs
                        extérieurs, etc.)
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

                <Button
                  type="submit"
                  id="submit"
                  primary
                  {...dataId('submit-button')}
                  className="mt-4 mr-2"
                >
                  Envoyer
                </Button>
                <LinkButton {...dataId('cancel-button')} href={routes.USER_LIST_PROJECTS}>
                  Annuler
                </LinkButton>
              </div>
            )}
          </div>
        </form>
      </div>
    </UserDashboard>
  )
})

hydrateOnClient(DemanderDelai)
