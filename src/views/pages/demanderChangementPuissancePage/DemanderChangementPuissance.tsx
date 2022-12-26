import React from 'react'
import { Project, ProjectAppelOffre } from '@entities'
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
} from '@components'
import { hydrateOnClient } from '../../helpers'
import { ChangementPuissance } from '.'
import routes from '@routes'

type DemanderChangementPuissanceProps = {
  request: Request
  project: Project
  appelOffre: ProjectAppelOffre
}

export const DemanderChangementPuissance = ({
  request,
  project,
  appelOffre,
}: DemanderChangementPuissanceProps) => {
  const { action, error, success, puissance, justification } = (request.query as any) || {}

  const doitChoisirCahierDesCharges =
    project.appelOffre?.choisirNouveauCahierDesCharges &&
    project.cahierDesChargesActuel === 'initial'

  return (
    <PageTemplate user={request.user} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header">
          <h3>Je signale un changement de puissance</h3>
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
                  identifiantGestionnaireRéseau: project.numeroGestionnaire,
                },
                redirectUrl: routes.DEMANDER_CHANGEMENT_PUISSANCE(project.id),
                type: action,
              }}
            />
          </div>
        ) : (
          <form action={routes.DEMANDE_ACTION} method="post" encType="multipart/form-data">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="type" value="puissance" />

            <div className="form__group">
              {success && <SuccessBox title={success} />}
              {error && <ErrorBox title={error} />}
              <FormulaireChampsObligatoireLégende className="text-right" />
              <div className="mb-2">Concernant le projet:</div>
              <ProjectInfo project={project} className="mb-3" />
              <div {...dataId('modificationRequest-demandesInputs')}>
                <ChangementPuissance
                  {...{
                    project,
                    puissance,
                    justification,
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
