import React, { useState } from 'react'
import { Project } from '@entities'
import { dataId } from '../../../helpers/testId'
import { Request } from 'express'

import {
  PageLayout,
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
  AlertBox,
  InfoBox,
  ExternalLink,
} from '@components'
import { ChoisirCahierDesChargesFormulaire } from '../choisirCahierDesChargesPage'
import { hydrateOnClient } from '../../helpers'
import routes from '@routes'

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
      project.appelOffre?.choisirNouveauCahierDesCharges &&
      !project.nouvellesRèglesDInstructionChoisies
    const [nouvellesRèglesDInstructionSéléctionnées] = useState(
      project.nouvellesRèglesDInstructionChoisies
    )

    return (
      <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header">
            <h3>Je signale un changement de producteur</h3>
          </div>

          <form
            action={routes.CHANGEMENT_PRODUCTEUR_ACTION}
            method="post"
            encType="multipart/form-data"
          >
            <input type="hidden" name="projetId" value={project.id} />
            <div className="form__group">
              <SuccessErrorBox success={success} error={error} />
              {doitChoisirCahierDesCharges && (
                <>
                  <InfoBox
                    title="Afin d'accéder au formulaire de changement de producteur, vous devez d'abord changer le
                  cahier des charges à appliquer"
                    className="mb-5"
                  >
                    <p className="m-0">
                      Pour plus d'informations sur les modalités d'instruction veuillez consulter
                      cette &nbsp;
                      <ExternalLink href="https://docs.potentiel.beta.gouv.fr/info/guide-dutilisation-potentiel/comment-faire-une-demande-de-modification-ou-informer-le-prefet-dun-changement">
                        page d'aide
                      </ExternalLink>
                      .
                    </p>
                  </InfoBox>
                  <ChoisirCahierDesChargesFormulaire
                    cahiersChargesURLs={cahiersChargesURLs}
                    projet={project}
                    redirectUrl={routes.CHANGER_PRODUCTEUR(project.id)}
                  />
                </>
              )}

              {(nouvellesRèglesDInstructionSéléctionnées || !doitChoisirCahierDesCharges) && (
                <>
                  <FormulaireChampsObligatoireLégende className="text-right" />
                  <div className="mb-2">Concernant le projet:</div>
                  <ProjectInfo project={project} className="mb-3"></ProjectInfo>
                  <div {...dataId('modificationRequest-demandesInputs')}>
                    <AlertBox
                      title="Attention : révocation des droits sur le projet"
                      className="my-7"
                    >
                      Une fois ce formulaire de changement de producteur envoyé, vous ne pourrez
                      plus suivre ce projet sur Potentiel. Tous les accès actuels seront retirés.
                      <br />
                      <span className="font-medium">
                        Le nouveau producteur pourra retrouver le projet dans les "projets à
                        réclamer"
                      </span>
                      .
                    </AlertBox>
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
                        Pour faciliter le traitement de votre demande, veillez à détailler les
                        raisons ayant conduit à ce besoin de modification (contexte, facteurs
                        extérieurs, etc).
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
                    <SecondaryLinkButton href={routes.USER_LIST_PROJECTS}>
                      Annuler
                    </SecondaryLinkButton>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(ChangerProducteur)
