import React from 'react';
import { ProjectAppelOffre } from '../../../entities';
import { Technologie } from '@potentiel/domain-views';
import { Request } from 'express';

import {
  ProjectInfo,
  PrimaryButton,
  FormulaireChampsObligatoireLégende,
  SecondaryLinkButton,
  InfoBox,
  ChoisirCahierDesChargesFormulaire,
  InfoLienGuideUtilisationCDC,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  ProjectProps,
  Form,
} from '../../components';
import { hydrateOnClient } from '../../helpers';
import { ChangementPuissance } from './components/ChangementPuissance';
import routes from '../../../routes';

type DemanderChangementPuissanceProps = {
  request: Request;
  project: ProjectProps & {
    cahierDesChargesActuel: string;
    technologie: Technologie;
    puissanceInitiale: number;
    puissance: number;
    unitePuissance: string;
  };
  appelOffre: ProjectAppelOffre;
};

export const DemanderChangementPuissance = ({
  request,
  project,
  appelOffre,
}: DemanderChangementPuissanceProps) => {
  const {
    error,
    success,
    puissance: puissanceSaisie,
    justification,
  } = (request.query as any) || {};

  const doitChoisirCahierDesCharges =
    appelOffre.choisirNouveauCahierDesCharges && project.cahierDesChargesActuel === 'initial';

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1 className="mb-10">Je signale un changement de puissance</Heading1>
      {doitChoisirCahierDesCharges ? (
        <ChoisirCahierDesChargesFormulaire
          projet={{
            id: project.id,
            appelOffre,
            cahierDesChargesActuel: 'initial',
            identifiantGestionnaireRéseau: project.identifiantGestionnaire,
          }}
          redirectUrl={routes.DEMANDER_CHANGEMENT_PUISSANCE(project.id)}
          type="puissance"
          infoBox={
            <InfoBox
              title="Afin d'accéder au formulaire de demande de modification, vous devez d'abord changer le
                  cahier des charges à appliquer"
              className="mb-5"
            >
              <InfoLienGuideUtilisationCDC />
            </InfoBox>
          }
        />
      ) : (
        <Form
          action={routes.CHANGEMENT_PUISSANCE_ACTION}
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
            <ProjectInfo project={project} className="mb-3" />
          </div>
          <ChangementPuissance
            {...{
              ...project,
              justification,
              appelOffre,
              puissanceSaisie,
            }}
          />
          <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
            <PrimaryButton type="submit" id="submit">
              Envoyer
            </PrimaryButton>
            <SecondaryLinkButton href={routes.PROJECT_DETAILS(project.id)}>
              Annuler
            </SecondaryLinkButton>
          </div>
        </Form>
      )}
    </LegacyPageTemplate>
  );
};

hydrateOnClient(DemanderChangementPuissance);
