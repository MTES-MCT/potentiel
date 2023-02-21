import React from 'react'
import { ProjectAppelOffre } from '@entities'
import { dataId } from '../../../helpers/testId'
import { Request } from 'express'

import {
  ProjectInfo,
  Button,
  FormulaireChampsObligatoireLégende,
  Label,
  SecondaryLinkButton,
  Astérisque,
  Input,
  TextArea,
  AlertBox,
  InfoBox,
  ChoisirCahierDesChargesFormulaire,
  InfoLienGuideUtilisationCDC,
  PageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  ProjectProps,
} from '@components'
import { hydrateOnClient } from '../../helpers'
import routes from '@routes'

type ChangerProducteurProps = {
  request: Request
  project: ProjectProps & { cahierDesChargesActuel: string }
  appelOffre: ProjectAppelOffre
}

export const ChangerProducteur = ({ request, project, appelOffre }: ChangerProducteurProps) => {
  const { error, success, justification } = (request.query as any) || {}

  const isEolien = appelOffre?.type === 'eolien'

  const doitChoisirCahierDesCharges =
    appelOffre.choisirNouveauCahierDesCharges && project.cahierDesChargesActuel === 'initial'

  return (
    <PageTemplate user={request.user} currentPage="list-requests">
      {' '}
      <div className="panel">
        <div className="panel__header">
          <Heading1>Je signale un changement de producteur</Heading1>
        </div>

        {doitChoisirCahierDesCharges ? (
          <div className="flex flex-col max-w-2xl mx-auto">
            <InfoBox
              title="Afin d'accéder au formulaire de changement de producteur, vous devez d'abord changer le
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
                  identifiantGestionnaireRéseau: project.identifiantGestionnaire,
                },
                redirectUrl: routes.CHANGER_PRODUCTEUR(project.id),
                type: 'producteur',
              }}
            />
          </div>
        ) : (
          <form
            action={routes.CHANGEMENT_PRODUCTEUR_ACTION}
            method="post"
            encType="multipart/form-data"
          >
            <input type="hidden" name="projetId" value={project.id} />
            <div className="form__group">
              {success && <SuccessBox title={success} />}
              {error && <ErrorBox title={error} />}

              <FormulaireChampsObligatoireLégende className="text-right" />
              <div className="mb-2">Concernant le projet:</div>
              <ProjectInfo project={project} className="mb-3"></ProjectInfo>
              <div {...dataId('modificationRequest-demandesInputs')}>
                <AlertBox title="Attention : révocation des droits sur le projet" className="my-7">
                  Une fois ce formulaire de changement de producteur envoyé, vous ne pourrez plus
                  suivre ce projet sur Potentiel. Tous les accès actuels seront retirés.
                  <br />
                  <span className="font-medium">
                    Le nouveau producteur pourra retrouver le projet dans les "projets à réclamer"
                  </span>
                  .
                </AlertBox>
                {isEolien && (
                  <ErrorBox
                    title="Vous ne pouvez pas changer de producteur avant la date d'achèvement de ce
                      projet."
                    className="my-4"
                  />
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
                    Pour faciliter le traitement de votre demande, veillez à détailler les raisons
                    ayant conduit à ce besoin de modification (contexte, facteurs extérieurs, etc).
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
                <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(ChangerProducteur)
