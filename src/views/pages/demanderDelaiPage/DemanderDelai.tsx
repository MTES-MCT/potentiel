import {
  ProjectInfo,
  SuccessErrorBox,
  TextArea,
  Astérisque,
  Input,
  FormulaireChampsObligatoireLégende,
  Button,
  SecondaryLinkButton,
  InfoBox,
  ChoisirCahierDesChargesFormulaire,
  InfoLienGuideUtilisationCDC,
  PageTemplate,
  SuccessBox,
} from '@components'
import routes from '@routes'
import { Project, ProjectAppelOffre } from '@entities'

import { Request } from 'express'
import React from 'react'
import format from 'date-fns/format'

import { dataId } from '../../../helpers/testId'
import { hydrateOnClient } from '../../helpers'

type DemanderDelaiProps = {
  request: Request
  project: Project
  appelOffre: ProjectAppelOffre
  validationErrors?: Array<{ [fieldName: string]: string }>
}

export const DemanderDelai = ({ request, project, appelOffre }: DemanderDelaiProps) => {
  const { error, success, justification, dateAchèvementDemandée } = (request.query as any) || {}

  const doitChoisirCahierDesCharges =
    project.appelOffre?.choisirNouveauCahierDesCharges &&
    project.cahierDesChargesActuel === 'initial'

  const nouvelleDateAchèvementMinimale = new Date(project.completionDueOn).setDate(
    new Date(project.completionDueOn).getDate() + 1
  )

  return (
    <PageTemplate user={request.user} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header" style={{ position: 'relative' }}>
          <h3>
            <span>Je demande un délai supplémentaire</span>
          </h3>
        </div>

        {doitChoisirCahierDesCharges ? (
          <div className="flex flex-col max-w-2xl mx-auto">
            <InfoBox
              title="Afin d'accéder au formulaire de demande de délai, vous devez d'abord changer le
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
                redirectUrl: routes.DEMANDER_DELAI(project.id),
                type: 'delai',
              }}
            />
          </div>
        ) : (
          <form action={routes.DEMANDE_DELAI_ACTION} method="post" encType="multipart/form-data">
            <input type="hidden" name="projectId" value={project.id} />
            <div className="form__group">
              {success && <SuccessBox title={success} />}
              {error && <SuccessErrorBox error={error} success={success} />}

              <FormulaireChampsObligatoireLégende className="text-right" />
              <div className="mb-1">Concernant le projet:</div>
              <ProjectInfo project={project} className="mb-3" />
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
                  {...dataId('submit-button')}
                  className="mt-4 mr-2"
                >
                  Envoyer
                </Button>
                <SecondaryLinkButton {...dataId('cancel-button')} href={routes.USER_LIST_PROJECTS}>
                  Annuler
                </SecondaryLinkButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </PageTemplate>
  )
}

hydrateOnClient(DemanderDelai)
