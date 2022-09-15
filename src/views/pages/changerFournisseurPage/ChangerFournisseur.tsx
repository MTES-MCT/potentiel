import React from 'react'
import { Project } from '@entities'
import routes from '@routes'
import { dataId } from '../../../helpers/testId'
import { Request } from 'express'

import {
  PageLayout,
  ChoisirCahierDesChargesFormulaire,
  UserDashboard,
  ProjectInfo,
  SuccessErrorBox,
  Button,
  Label,
  SecondaryLinkButton,
  InfoBox,
} from '@components'
import { hydrateOnClient } from '../../helpers'
import {
  CHAMPS_FOURNISSEURS,
  CORRESPONDANCE_CHAMPS_FOURNISSEURS_COLONNE_IMPORT,
} from '@modules/project'
import { InfoLienVersGuideUtilisation } from '../choisirCahierDesChargesPage'

type ChangerFournisseurProps = {
  request: Request
  project: Project
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ChangerFournisseur = PageLayout(
  ({ request, project, cahiersChargesURLs }: ChangerFournisseurProps) => {
    const { error, success, justification } = (request.query as any) || {}

    const doitChoisirCahierDesCharges =
      project.appelOffre?.choisirNouveauCahierDesCharges &&
      !project.nouvellesRèglesDInstructionChoisies

    return (
      <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header">
            <h3>Je signale un changement de fournisseur</h3>
          </div>

          {doitChoisirCahierDesCharges ? (
            <div className="flex flex-col max-w-2xl mx-auto">
              <InfoBox
                title="Afin d'accéder au formulaire de changement de fournisseur, vous devez d'abord changer le
                  cahier des charges à appliquer"
                className="mb-5"
              >
                <InfoLienVersGuideUtilisation />
              </InfoBox>
              <ChoisirCahierDesChargesFormulaire
                cahiersChargesURLs={cahiersChargesURLs}
                projet={project}
                redirectUrl={routes.CHANGER_FOURNISSEUR(project.id)}
                type="fournisseur"
              />
            </div>
          ) : (
            <form
              action={routes.CHANGEMENT_FOURNISSEUR_ACTION}
              method="post"
              encType="multipart/form-data"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <div className="form__group">
                <div className="mb-2">Concernant le projet:</div>
                <ProjectInfo project={project} className="mb-3"></ProjectInfo>
                <SuccessErrorBox success={success} error={error} />

                {CHAMPS_FOURNISSEURS.map((champ) => {
                  return (
                    <div>
                      <h3 style={{ marginTop: 15, marginBottom: 3 }}>{champ}</h3>
                      <label>Ancien fournisseur</label>
                      <input
                        type="text"
                        disabled
                        defaultValue={
                          project.details?.[
                            CORRESPONDANCE_CHAMPS_FOURNISSEURS_COLONNE_IMPORT[champ]
                          ]
                        }
                      />
                      <label htmlFor={champ} className="mt-2">
                        Nouveau fournisseur
                      </label>
                      <input type="text" name={champ} id={champ} />
                    </div>
                  )
                })}
                {project.evaluationCarbone > 0 && (
                  <div>
                    <h3 style={{ marginTop: 15, marginBottom: 3 }}>évaluation carbone</h3>
                    <label>Ancienne évaluation carbone (kg eq CO2/kWc)</label>
                    <input
                      type="number"
                      disabled
                      defaultValue={project.evaluationCarbone}
                      {...dataId('modificationRequest-oldEvaluationCarboneField')}
                    />
                    <label htmlFor="evaluationCarbone">
                      Nouvelle évaluation carbone (kg eq CO2/kWc)
                    </label>
                    <input
                      type="number"
                      name="evaluationCarbone"
                      id="evaluationCarbone"
                      {...dataId('modificationRequest-evaluationCarboneField')}
                    />
                  </div>
                )}
                <label htmlFor="candidats" className="mt-6">
                  Pièce-jointe
                </label>
                <input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-fileField')}
                  id="file"
                />
                <Label htmlFor="justification" className="mt-4">
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

                <Button
                  className="mt-3 mr-1"
                  type="submit"
                  id="submit"
                  {...dataId('submit-button')}
                >
                  Envoyer
                </Button>
                <SecondaryLinkButton href={routes.USER_LIST_PROJECTS}>Annuler</SecondaryLinkButton>
              </div>
            </form>
          )}
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(ChangerFournisseur)
