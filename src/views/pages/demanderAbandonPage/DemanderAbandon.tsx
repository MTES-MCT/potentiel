import React from 'react';
import { ProjectAppelOffre } from '@entities';
import routes from '@routes';
import { dataId } from '../../../helpers/testId';
import { Request } from 'express';

import {
  ProjectInfo,
  PrimaryButton,
  FormulaireChampsObligatoireLégende,
  Label,
  InfoBox,
  ChoisirCahierDesChargesFormulaire,
  InfoLienGuideUtilisationCDC,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  SecondaryLinkButton,
  ProjectProps,
  Input,
  TextArea,
} from '@components';
import { hydrateOnClient } from '../../helpers';

type DemanderAbandonProps = {
  request: Request;
  project: ProjectProps & { cahierDesChargesActuel: string };
  appelOffre: ProjectAppelOffre;
};

export const DemanderAbandon = ({ request, project, appelOffre }: DemanderAbandonProps) => {
  const { error, success, justification } = (request.query as any) || {};

  const doitChoisirCahierDesCharges =
    appelOffre.choisirNouveauCahierDesCharges && project.cahierDesChargesActuel === 'initial';

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <div className="panel">
        <div className="panel__header">
          <Heading1>Je demande un abandon de mon projet</Heading1>
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
                  identifiantGestionnaireRéseau: project.identifiantGestionnaire,
                },
                redirectUrl: routes.GET_DEMANDER_ABANDON(project.id),
                type: 'abandon',
              }}
            />
          </div>
        ) : (
          <form action={routes.POST_DEMANDER_ABANDON} method="post" encType="multipart/form-data">
            <input type="hidden" name="projectId" value={project.id} />
            <div className="form__group">
              {success && <SuccessBox title={success} />}
              {error && <ErrorBox title={error} />}
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
                <TextArea
                  name="justification"
                  id="justification"
                  defaultValue={justification || ''}
                  {...dataId('modificationRequest-justificationField')}
                />
                <Label htmlFor="file">Pièce justificative</Label>
                <Input
                  type="file"
                  name="file"
                  {...dataId('modificationRequest-fileField')}
                  id="file"
                />
                <PrimaryButton
                  className="mt-3 mr-1"
                  type="submit"
                  id="submit"
                  {...dataId('submit-button')}
                >
                  Envoyer
                </PrimaryButton>
                <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
              </div>
            </div>
          </form>
        )}
      </div>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DemanderAbandon);
