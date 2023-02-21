import React from 'react'
import { ProjectAppelOffre, Technologie } from '@entities'
import { dataId } from '../../../helpers/testId'
import { Request } from 'express'

import {
  ProjectInfo,
  Button,
  FormulaireChampsObligatoireLégende,
  SecondaryLinkButton,
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
import { ChangementPuissance } from './components/ChangementPuissance'
import routes from '@routes'

type DemanderChangementPuissanceProps = {
  request: Request
  project: ProjectProps & {
    cahierDesChargesActuel: string
    technologie: Technologie
    puissanceInitiale: number
    puissance: number
  }
  appelOffre: ProjectAppelOffre
}

export const DemanderChangementPuissance = ({
  request,
  project,
  appelOffre,
}: DemanderChangementPuissanceProps) => {
  const { error, success, puissance, justification } = (request.query as any) || {}

  const doitChoisirCahierDesCharges =
    appelOffre.choisirNouveauCahierDesCharges && project.cahierDesChargesActuel === 'initial'

  return (
    <PageTemplate user={request.user} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Je signale un changement de puissance</Heading1>
        </div>
        {doitChoisirCahierDesCharges ? (
          <div className="flex flex-col max-w-2xl mx-auto">
            <InfoBox
              title="Afin d'accéder au formulaire de demande de modification, vous devez d'abord changer le
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
                redirectUrl: routes.DEMANDER_CHANGEMENT_PUISSANCE(project.id),
                type: 'puissance',
              }}
            />
          </div>
        ) : (
          <form
            action={routes.CHANGEMENT_PUISSANCE_ACTION}
            method="post"
            encType="multipart/form-data"
          >
            <input type="hidden" name="projectId" value={project.id} />

            <div className="form__group">
              {success && <SuccessBox title={success} />}
              {error && <ErrorBox title={error} />}
              <FormulaireChampsObligatoireLégende className="text-right" />
              <div className="mb-2">Concernant le projet:</div>
              <ProjectInfo project={project} className="mb-3" />
              <div {...dataId('modificationRequest-demandesInputs')}>
                <ChangementPuissance
                  {...{
                    ...project,
                    justification,
                    appelOffre,
                  }}
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

hydrateOnClient(DemanderChangementPuissance)
