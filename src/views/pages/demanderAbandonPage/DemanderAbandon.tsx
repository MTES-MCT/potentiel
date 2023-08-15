import React from 'react';
import { ProjectAppelOffre } from '../../../entities';
import routes from '../../../routes';
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
  Form,
} from '../../components';
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
      <Heading1 className="mb-10">Je demande un abandon de mon projet</Heading1>

      {doitChoisirCahierDesCharges ? (
        <ChoisirCahierDesChargesFormulaire
          projet={{
            id: project.id,
            appelOffre,
            cahierDesChargesActuel: 'initial',
            identifiantGestionnaireRéseau: project.identifiantGestionnaire,
          }}
          redirectUrl={routes.GET_DEMANDER_ABANDON(project.id)}
          type="abandon"
          infoBox={
            <InfoBox
              title="Afin d'accéder au formulaire de demande d'abandon, vous devez d'abord changer le
                  cahier des charges à appliquer"
              className="mb-5"
            >
              <InfoLienGuideUtilisationCDC />
            </InfoBox>
          }
        />
      ) : (
        <Form
          action={routes.POST_DEMANDER_ABANDON}
          method="post"
          encType="multipart/form-data"
          className="mx-auto"
        >
          <input type="hidden" name="projectId" value={project.id} />
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
          <FormulaireChampsObligatoireLégende className="text-right" />
          <div>
            <div className="mb-2">Concernant le projet:</div>
            <ProjectInfo project={project} />
          </div>
          <div>
            <Label htmlFor="justification">
              <strong>Veuillez nous indiquer les raisons qui motivent votre demande</strong>
              <br />
              Pour faciliter le traitement de votre demande, veillez à détailler les raisons ayant
              conduit à ce besoin de modification (contexte, facteurs extérieurs, etc)
            </Label>
            <TextArea name="justification" id="justification" defaultValue={justification || ''} />
          </div>
          <div>
            <Label htmlFor="file">Pièce justificative</Label>
            <Input type="file" name="file" id="file" />
          </div>
          <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
            <PrimaryButton type="submit" id="submit">
              Envoyer
            </PrimaryButton>
            <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
          </div>
        </Form>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DemanderAbandon);
