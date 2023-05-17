import React from 'react';
import { Request } from 'express';
import {
  PrimaryButton,
  ErrorBox,
  Heading1,
  Input,
  LegacyPageTemplate,
  ProjectInfo,
  SecondaryLinkButton,
  Label,
  FormulaireChampsObligatoireLégende,
  TextArea,
} from '@components';
import routes from '@routes';
import { ProjectDataForSignalerDemandeRecoursPage } from '@modules/project';
import { hydrateOnClient } from '../../helpers/hydrateOnClient';

type SignalerDemandeRecoursProps = {
  request: Request;
  project: ProjectDataForSignalerDemandeRecoursPage;
  validationErrors?: Array<{ [fieldName: string]: string }>;
};
export const SignalerDemandeRecours = ({
  request,
  project,
  validationErrors,
}: SignalerDemandeRecoursProps) => {
  const { query, user } = request;
  const { error } = query as any;
  return (
    <LegacyPageTemplate user={user} currentPage="list-projects">
      <div className="panel__header">
        <Heading1>Enregistrer une demande de recours traitée hors Potentiel</Heading1>
      </div>
      {error && <ErrorBox title={error} />}
      <form
        action={routes.ADMIN_SIGNALER_DEMANDE_RECOURS_POST}
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col gap-5"
      >
        <div>
          <p className="m-0">Pour le projet</p>
          <ProjectInfo project={project}>
            <p className="m-0">
              Statut actuel du projet <span className="font-bold">{project.status}</span>
            </p>
          </ProjectInfo>
        </div>

        <FormulaireChampsObligatoireLégende className="ml-auto" />

        <Input name="projectId" value={project.id} readOnly hidden />

        <div>
          <p className="m-0">Décision* :</p>
          <div className="flex flex-col lg:flex-row gap-3 my-2">
            <div className="flex flex-row">
              <input
                type="radio"
                id="status-accepted"
                value="acceptée"
                name="status"
                defaultChecked
                required
              />
              <Label htmlFor="status-accepted" required>
                Demande acceptée
              </Label>
            </div>
            <div className="flex flex-row">
              <input type="radio" id="status-rejected" value="rejetée" name="status" required />
              <Label htmlFor="status-rejected" required>
                Demande rejetée
              </Label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="decidedOn" required>
            Date de la décision (=date du courrier)
          </Label>
          <Input
            type="date"
            name="decidedOn"
            id="decidedOn"
            required
            {...(validationErrors && { error: validationErrors['decidedOn']?.toString() })}
          />
        </div>

        <div>
          <Label htmlFor="file" required>
            Courrier de la réponse (fichier joint)
          </Label>
          <Input name="file" type="file" className="rounded-none" id="file" required />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <TextArea
            className="bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none"
            name="notes"
            id="notes"
          />
        </div>
        <div className="m-auto flex gap-4">
          <PrimaryButton type="submit">Enregistrer</PrimaryButton>
          <SecondaryLinkButton href={routes.PROJECT_DETAILS(project.id)}>
            Annuler
          </SecondaryLinkButton>
        </div>
      </form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(SignalerDemandeRecours);
