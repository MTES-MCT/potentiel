import React, { useState } from 'react';
import { ProjectAppelOffre } from '../../../entities';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Request } from 'express';

import {
  ProjectInfo,
  PrimaryButton,
  SecondaryLinkButton,
  ChoisirCahierDesChargesFormulaire,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  ProjectProps,
  Form,
} from '../../components';
import { hydrateOnClient } from '../../helpers';
import { ChangementPuissance, ChangementPuissanceProps } from './components/ChangementPuissance';
import routes from '../../../routes';

type DemanderChangementPuissanceProps = {
  request: Request;
  project: ProjectProps & {
    cahierDesChargesActuel: string;
    technologie: AppelOffre.Technologie;
    puissanceInitiale: number;
    puissance: number;
    unitePuissance: string;
    désignationCatégorie?: ChangementPuissanceProps['désignationCatégorie'];
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
    appelOffre.periode.choisirNouveauCahierDesCharges &&
    project.cahierDesChargesActuel === 'initial';

  const [disableSubmit, setDisableSubmit] = useState(false);

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
          cahiersDesChargesUrl={project.cahiersDesChargesUrl}
          formulaireModificationProjet={true}
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
              onUpdateEtatFormulaire: (bloquerEnvoi) => setDisableSubmit(bloquerEnvoi),
            }}
          />
          <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
            <PrimaryButton type="submit" id="submit" disabled={disableSubmit}>
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
