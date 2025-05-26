import React from 'react';
import { ProjectAppelOffre } from '../../../entities';
import { Request } from 'express';

import {
  ModificationRequestActionTitles,
  ProjectInfo,
  PrimaryButton,
  SecondaryLinkButton,
  LegacyPageTemplate,
  SuccessBox,
  ErrorBox,
  Heading1,
  ProjectProps,
  Form,
} from '../../components';
import { hydrateOnClient } from '../../helpers';
import routes from '../../../routes';

type NewModificationRequestProps = {
  request: Request;
  project: ProjectProps & { cahierDesChargesActuel: string };
  appelOffre: ProjectAppelOffre;
};

export const NewModificationRequest = ({
  request,
  project,
  appelOffre,
}: NewModificationRequestProps) => {
  const { action, error, success } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-requests">
      <Heading1 className="mb-10">
        <ModificationRequestActionTitles action={action} />
      </Heading1>

      <Form
        action={routes.DEMANDE_ACTION}
        method="post"
        encType="multipart/form-data"
        className="mx-auto"
      >
        <input type="hidden" name="projectId" value={project.id} />
        <input type="hidden" name="type" value={action} />

        {success && <SuccessBox title={success} />}
        {error && <ErrorBox title={error} />}

        <div>
          <div className="mb-2">Concernant le projet:</div>
          <ProjectInfo project={project} />
        </div>

        <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
          <PrimaryButton type="submit" id="submit">
            Envoyer
          </PrimaryButton>
          <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
        </div>
      </Form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(NewModificationRequest);
