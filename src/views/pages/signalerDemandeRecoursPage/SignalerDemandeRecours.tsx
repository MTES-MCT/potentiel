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
  TextArea,
  Radio,
  Form,
  ChampsObligatoiresLégende,
} from '../../components';
import routes from '../../../routes';
import { ProjectDataForSignalerDemandeRecoursPage } from '../../../modules/project';
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
      <Heading1 className="mb-10">
        Enregistrer une demande de recours traitée hors Potentiel
      </Heading1>
      {error && <ErrorBox title={error} />}
      <Form
        action={routes.ADMIN_SIGNALER_DEMANDE_RECOURS_POST}
        method="POST"
        encType="multipart/form-data"
        className="mx-auto"
      >
        <div>
          <p className="m-0">Pour le projet</p>
          <ProjectInfo project={project}>
            <p className="m-0">
              Statut actuel du projet <span className="font-bold">{project.status}</span>
            </p>
          </ProjectInfo>
        </div>

        <ChampsObligatoiresLégende />

        <Input name="projectId" value={project.id} readOnly hidden />

        <div>
          <legend className="m-0">Décision :</legend>
          <ul className="flex flex-col lg:flex-row gap-3 my-2 p-0 list-none">
            <li>
              <Radio
                id="status-accepted"
                value="acceptée"
                name="status"
                defaultChecked
                required
                aria-required="true"
              >
                Demande acceptée
              </Radio>
            </li>
            <li>
              <Radio
                id="status-rejected"
                value="rejetée"
                name="status"
                required
                aria-required="true"
              >
                Demande rejetée
              </Radio>
            </li>
          </ul>
        </div>

        <div>
          <Label htmlFor="decidedOn">Date de la décision (=date du courrier)</Label>
          <Input
            type="date"
            name="decidedOn"
            id="decidedOn"
            {...(validationErrors && { error: validationErrors['decidedOn']?.toString() })}
            required
            aria-required="true"
          />
        </div>

        <div>
          <Label htmlFor="file">Courrier de la réponse (fichier joint)</Label>
          <Input
            name="file"
            type="file"
            className="rounded-none"
            id="file"
            required
            aria-required="true"
          />
        </div>

        <div>
          <Label htmlFor="notes" optionnel>
            Notes
          </Label>
          <TextArea
            className="bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none"
            name="notes"
            id="notes"
          />
        </div>
        <div className="mx-auto flex flex-col md:flex-row gap-4 items-center">
          <PrimaryButton type="submit">Enregistrer</PrimaryButton>
          <SecondaryLinkButton href={routes.LISTE_PROJETS}>Annuler</SecondaryLinkButton>
        </div>
      </Form>
    </LegacyPageTemplate>
  );
};

hydrateOnClient(SignalerDemandeRecours);
