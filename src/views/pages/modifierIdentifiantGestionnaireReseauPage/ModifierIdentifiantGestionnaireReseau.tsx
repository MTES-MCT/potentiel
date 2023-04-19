import React from 'react';
import { Request } from 'express';

import {
  Button,
  ErrorBox,
  Heading1,
  Heading2,
  LegacyPageTemplate,
  ProjectInfo,
  ProjectProps,
  SecondaryLinkButton,
  SuccessBox,
} from '@components';
import { hydrateOnClient } from '../../helpers';
import routes from '@routes';
import { GestionnaireRéseauFormInputs } from './GestionnaireRéseauFormInputs';
import { GestionnaireRéseauReadModel } from '@potentiel/domain';

type ModifierIdentifiantGestionnaireReseauProps = {
  request: Request;
  projet: ProjectProps;
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
};

export const ModifierIdentifiantGestionnaireReseau = ({
  request,
  projet,
  gestionnairesRéseau: listeGestionnairesRéseau,
}: ModifierIdentifiantGestionnaireReseauProps) => {
  const { error, success } = (request.query as any) || {};

  return (
    <LegacyPageTemplate user={request.user} currentPage="list-projects">
      <div className="panel">
        <div className="panel__header">
          <Heading1>
            {projet.identifiantGestionnaire
              ? "Je modifie l'identifiant du dossier de raccordement"
              : "J'ajoute l'identifiant du dossier de raccordement"}
          </Heading1>
        </div>

        <form
          action={routes.POST_MODIFIER_IDENTIFIANT_GESTIONNAIRE_RESEAU}
          method="post"
          className="flex flex-col gap-5"
        >
          {success && <SuccessBox title={success} />}
          {error && <ErrorBox title={error} />}
          <div>
            <Heading2>Concernant le projet</Heading2>
            <ProjectInfo project={projet} className="mb-3" />
          </div>

          <input type="hidden" name="projetId" value={projet.id} />

          <GestionnaireRéseauFormInputs
            identifiantGestionnaireRéseauActuel={projet.identifiantGestionnaire}
          />

          <div className="m-auto flex">
            <Button className="mr-1" type="submit">
              Envoyer
            </Button>
            <SecondaryLinkButton href={routes.PROJECT_DETAILS(projet.id)}>
              Annuler
            </SecondaryLinkButton>
          </div>
        </form>
      </div>
    </LegacyPageTemplate>
  );
};
hydrateOnClient(ModifierIdentifiantGestionnaireReseau);
