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
  Label,
  SecondaryLinkButton,
} from '@components'
import { hydrateOnClient } from '../../helpers'

type ChangerFournisseurProps = {
  request: Request
  project: Project
  cahiersChargesURLs?: { oldCahierChargesURL?: string; newCahierChargesURL?: string }
}

export const ChangerFournisseur = PageLayout(
  ({ request, project, cahiersChargesURLs }: ChangerFournisseurProps) => {
    const { error, success, justification } = (request.query as any) || {}

    const doitChoisirCahierDesCharges =
      project.appelOffre?.choisirNouveauCahierDesCharges && !project.newRulesOptIn
    const [newRulesOptInSelectionné, setNewRulesOptInSelectionné] = useState(project.newRulesOptIn)

    return (
      <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header">
            <h3>Je signale un changement de fournisseur</h3>
          </div>

          <form
            action={ROUTES.CHANGEMENT_FOURNISSEUR_ACTION}
            method="post"
            encType="multipart/form-data"
          >
            <input type="hidden" name="projectId" value={project.id} />
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
                    onChoiceChange={(isNewRule: boolean) => {
                      setNewRulesOptInSelectionné(isNewRule)
                    }}
                  />
                </div>
              )}

              {(newRulesOptInSelectionné || !doitChoisirCahierDesCharges) && (
                <>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Modules ou films</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={project.details?.['Nom du fabricant \n(Modules ou films)']}
                    />
                    <label htmlFor="Fournisseur modules ou films">Nouveau fournisseur</label>
                    <input
                      type="text"
                      name="Fournisseur modules ou films"
                      id="Fournisseur modules ou films"
                      {...dataId('Fournisseur modules ou films')}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Cellules</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={project.details?.['Nom du fabricant (Cellules)']}
                    />
                    <label htmlFor="Fournisseur cellules">Nouveau fournisseur</label>
                    <input
                      type="text"
                      name="Fournisseur cellules"
                      id="Fournisseur cellules"
                      {...dataId('Fournisseur cellules')}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Plaquettes de silicium (wafers)</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={
                        project.details?.['Nom du fabricant \n(Plaquettes de silicium (wafers))']
                      }
                    />
                    <label htmlFor="Fournisseur plaquettes de silicium (wafers)">
                      Nouveau fournisseur
                    </label>
                    <input
                      type="text"
                      name="Fournisseur plaquettes de silicium (wafers)"
                      id="Fournisseur plaquettes de silicium (wafers)"
                      {...dataId('Fournisseur plaquettes de silicium (wafers)')}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Polysilicium</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={project.details?.['Nom du fabricant \n(Polysilicium)']}
                    />
                    <label htmlFor="Fournisseur polysilicium">Nouveau fournisseur</label>
                    <input
                      type="text"
                      name="Fournisseur polysilicium"
                      id="Fournisseur polysilicium"
                      {...dataId('Fournisseur polysilicium')}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Postes de conversion</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={project.details?.['Nom du fabricant \n(Postes de conversion)']}
                    />
                    <label htmlFor="Fournisseur postes de conversion">Nouveau fournisseur</label>
                    <input
                      type="text"
                      name="Fournisseur postes de conversion"
                      id="Fournisseur postes de conversion"
                      {...dataId('modificationRequest-Fournisseur postes de conversionField')}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Structure</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={project.details?.['Nom du fabricant \n(Structure)']}
                    />
                    <label htmlFor="Fournisseur structures">Nouveau fournisseur</label>
                    <input
                      type="text"
                      name="Fournisseur structures"
                      id="Fournisseur structures"
                      {...dataId('modificationRequest-Fournisseur structuresField')}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Dispositifs de stockage de l’énergie</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={
                        project.details?.[
                          'Nom du fabricant \n(Dispositifs de stockage de l’énergie *)'
                        ]
                      }
                    />
                    <label htmlFor="Fournisseur dispositifs de stockage de l’énergie">
                      Nouveau fournisseur
                    </label>
                    <input
                      type="text"
                      name="Fournisseur dispositifs de stockage de l’énergie"
                      id="Fournisseur dispositifs de stockage de l’énergie"
                      {...dataId(
                        'modificationRequest-Fournisseur dispositifs de stockage de l’énergieField'
                      )}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Dispositifs de suivi de la course du soleil</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={
                        project.details?.[
                          'Nom du fabricant \n(Dispositifs de suivi de la course du soleil *)'
                        ]
                      }
                    />
                    <label htmlFor="Fournisseur dispositifs de suivi de la course du soleil">
                      Nouveau fournisseur
                    </label>
                    <input
                      type="text"
                      name="Fournisseur dispositifs de suivi de la course du soleil"
                      id="Fournisseur dispositifs de suivi de la course du soleil"
                      {...dataId(
                        'modificationRequest-Fournisseur dispositifs de suivi de la course du soleilField'
                      )}
                    />
                  </div>
                  <div>
                    <h3 style={{ marginTop: 15 }}>Autres technologies</h3>
                    <label>Ancien fournisseur</label>
                    <input
                      type="text"
                      disabled
                      defaultValue={project.details?.['Nom du fabricant \n(Autres technologies)']}
                    />
                    <label htmlFor="Fournisseur autres technologies">Nouveau fournisseur</label>
                    <input
                      type="text"
                      name="Fournisseur autres technologies"
                      id="Fournisseur autres technologies"
                      {...dataId('modificationRequest-Fournisseur autres technologiesField')}
                    />
                  </div>
                  {project.evaluationCarbone > 0 && (
                    <div>
                      <h3 style={{ marginTop: 15 }}>Evaluation carbone</h3>
                      <label>Ancienne évaluation carbone (kg eq CO2/kWc)</label>
                      <input
                        type="text"
                        disabled
                        defaultValue={project.evaluationCarbone}
                        {...dataId('modificationRequest-oldEvaluationCarboneField')}
                      />
                      <label htmlFor="evaluationCarbone">
                        Nouvelle évaluation carbone (kg eq CO2/kWc)
                      </label>
                      <input
                        type="text"
                        name="evaluationCarbone"
                        id="evaluationCarbone"
                        {...dataId('modificationRequest-evaluationCarboneField')}
                      />
                    </div>
                  )}
                  <div
                    className="notification warning hidden"
                    style={{ display: 'none' }}
                    {...dataId('modificationRequest-evaluationCarbone-error-message-out-of-bounds')}
                  >
                    Cette nouvelle valeur entraîne une dégradation de la note du projet, celui-ci ne
                    recevra pas d'attestation de conformité.
                  </div>
                  <div
                    className="notification error hidden"
                    style={{ display: 'none' }}
                    {...dataId('modificationRequest-evaluationCarbone-error-message-wrong-format')}
                  >
                    Le format saisi n’est pas conforme (si l'évaluation carbone est un nombre
                    décimal, pensez à utiliser un point au lieu de la virgule).
                  </div>
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
                  <SecondaryLinkButton href={ROUTES.USER_LIST_PROJECTS}>
                    Annuler
                  </SecondaryLinkButton>
                </>
              )}
            </div>
          </form>
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(ChangerFournisseur)
