import React, { useState } from 'react'
import { Project, ProjectAppelOffre } from '@entities'
import routes from '@routes'
import { dataId } from '../../../helpers/testId'
import { Request } from 'express'

import {
  ChoisirCahierDesChargesFormulaire,
  ProjectInfo,
  SuccessErrorBox,
  Button,
  Label,
  SecondaryLinkButton,
  InfoBox,
  InfoLienGuideUtilisationCDC,
  AlertBox,
  PageTemplate,
} from '@components'
import { hydrateOnClient } from '../../helpers'
import { CHAMPS_FOURNISSEURS, CORRESPONDANCE_CHAMPS_FOURNISSEURS } from '@modules/project'

type ChangerFournisseurProps = {
  request: Request
  project: Project
  appelOffre: ProjectAppelOffre
}

export const ChangerFournisseur = ({ request, project, appelOffre }: ChangerFournisseurProps) => {
  const { error, success, justification } = (request.query as any) || {}

  const doitChoisirCahierDesCharges =
    project.appelOffre?.choisirNouveauCahierDesCharges &&
    project.cahierDesChargesActuel === 'initial'

  const [evaluationCarbone, setEvaluationCarbone] = useState<number | undefined>()

  return (
    <PageTemplate user={request.user} currentPage="list-requests">
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
              <InfoLienGuideUtilisationCDC />
            </InfoBox>
            <ChoisirCahierDesChargesFormulaire
              {...{
                projet: {
                  id: project.id,
                  appelOffre,
                  cahierDesChargesActuel: 'initial',
                  identifiantGestionnaireRéseau: project.numeroGestionnaire,
                },
                redirectUrl: routes.CHANGER_FOURNISSEUR(project.id),
                type: 'fournisseur',
              }}
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
              <ProjectInfo project={project} className="mb-3" />
              <SuccessErrorBox success={success} error={error} />

              {CHAMPS_FOURNISSEURS.map((champ) => {
                return (
                  <div key={champ}>
                    <h3 style={{ marginTop: 15, marginBottom: 3 }}>
                      {CORRESPONDANCE_CHAMPS_FOURNISSEURS[champ]}
                    </h3>
                    <label>Ancien fournisseur</label>
                    <input type="text" disabled defaultValue={project.details?.[champ]} />
                    <label htmlFor={champ} className="mt-2">
                      {champ}
                    </label>
                    <input type="text" name={champ.replace(/\n/g, '\\n')} id={champ} />
                  </div>
                )
              })}
              {project.evaluationCarbone > 0 && (
                <div>
                  <h3 style={{ marginTop: 15, marginBottom: 3 }}>évaluation carbone</h3>
                  <label>Évaluation carbone initiale (kg eq CO2/kWc)</label>
                  <input
                    type="number"
                    disabled
                    defaultValue={project.evaluationCarboneDeRéférence}
                  />
                  <label>Évaluation carbone actuelle (kg eq CO2/kWc)</label>
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
                    onChange={(e) => setEvaluationCarbone(parseFloat(e.target.value))}
                    type="number"
                    name="evaluationCarbone"
                    id="evaluationCarbone"
                    {...dataId('modificationRequest-evaluationCarboneField')}
                  />
                  {evaluationCarbone &&
                    evaluationCarbone > project.evaluationCarboneDeRéférence &&
                    Math.round(evaluationCarbone / 50) !==
                      Math.round(project.evaluationCarboneDeRéférence / 50) && (
                      <AlertBox className="mt-4">
                        Cette nouvelle valeur entraîne une dégradation de la note du projet,
                        celui-ci ne recevra pas d'attestation de conformité.
                      </AlertBox>
                    )}
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
                Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
                conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
              </Label>
              <textarea
                name="justification"
                id="justification"
                defaultValue={justification || ''}
                {...dataId('modificationRequest-justificationField')}
              />

              <Button className="mt-3 mr-1" type="submit" id="submit" {...dataId('submit-button')}>
                Envoyer
              </Button>
              <SecondaryLinkButton href={routes.USER_LIST_PROJECTS}>Annuler</SecondaryLinkButton>
            </div>
          </form>
        )}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(ChangerFournisseur)
