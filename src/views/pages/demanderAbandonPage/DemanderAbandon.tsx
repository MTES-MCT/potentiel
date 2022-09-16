import React from 'react'
import { Project, ProjectAppelOffre } from '@entities'
import routes from '@routes'
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
  InfoBox,
  ChoisirCahierDesChargesFormulaire,
  InfoLienGuideUtilisationCDC,
} from '@components'
import { hydrateOnClient } from '../../helpers'

type DemanderAbandonProps = {
  request: Request
  project: Project
  appelOffre: ProjectAppelOffre
}

export const DemanderAbandon = PageLayout(
  ({ request, project, appelOffre }: DemanderAbandonProps) => {
    const { error, success, justification } = (request.query as any) || {}

    const doitChoisirCahierDesCharges =
      project.appelOffre?.choisirNouveauCahierDesCharges &&
      !project.nouvellesRèglesDInstructionChoisies

    return (
      <UserDashboard currentPage={'list-requests'}>
        <div className="panel">
          <div className="panel__header">
            <h3>Je demande un abandon de mon projet</h3>
          </div>

          {doitChoisirCahierDesCharges ? (
            <div className="flex flex-col max-w-2xl mx-auto">
              <InfoBox
                title="Afin d'accéder au formulaire de demande d'abandon, vous devez d'abord changer le
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
                  },
                  redirectUrl: routes.DEMANDER_ABANDON(project.id),
                  type: 'abandon',
                }}
              />
            </div>
          ) : (
            <form
              action={routes.DEMANDE_ABANDON_ACTION}
              method="post"
              encType="multipart/form-data"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <div className="form__group">
                <SuccessErrorBox success={success} error={error} />
                <FormulaireChampsObligatoireLégende className="text-right" />

                <div className="mb-2">Concernant le projet:</div>
                <ProjectInfo project={project} className="mb-3" />
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
                    href={routes.USER_LIST_PROJECTS}
                  >
                    Annuler
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </UserDashboard>
    )
  }
)

hydrateOnClient(DemanderAbandon)
