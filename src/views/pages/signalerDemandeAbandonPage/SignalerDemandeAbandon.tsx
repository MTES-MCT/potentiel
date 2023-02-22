import React from 'react';
import { Request } from 'express';
import {
  Button,
  Input,
  PageTemplate,
  ProjectInfo,
  SecondaryLinkButton,
  ErrorBox,
  Heading1,
} from '@components';
import routes from '@routes';
import { ProjectDataForSignalerDemandeAbandonPage } from '@modules/project';
import { hydrateOnClient } from '../../helpers/hydrateOnClient';

type SignalerDemandeAbandonProps = {
  request: Request;
  project: ProjectDataForSignalerDemandeAbandonPage;
  validationErrors?: Array<{ [fieldName: string]: string }>;
};
export const SignalerDemandeAbandon = ({
  request,
  project,
  validationErrors,
}: SignalerDemandeAbandonProps) => {
  const { query, user } = request;
  const { error } = query as any;
  return (
    <PageTemplate user={user} currentPage="list-projects">
      <main role="main" className="panel">
        <div className="panel__header">
          <Heading1>Enregistrer une demande d'abandon traitée hors Potentiel</Heading1>
        </div>
        {error && <ErrorBox title={error} />}
        <form
          action={routes.ADMIN_SIGNALER_DEMANDE_ABANDON_POST}
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

          <input name="projectId" value={project.id} readOnly hidden />

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
                <label htmlFor="status-accepted">Demande acceptée</label>
              </div>
              <div className="flex flex-row">
                <input type="radio" id="status-rejected" value="rejetée" name="status" required />
                <label htmlFor="status-rejected">Demande rejetée</label>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="decidedOn">Date de la décision (=date du courrier)*</label>
            <Input
              type="date"
              name="decidedOn"
              id="decidedOn"
              required
              {...(validationErrors && { error: validationErrors['decidedOn']?.toString() })}
            />
          </div>

          <div>
            <label htmlFor="file">Courrier de la réponse (fichier joint)</label>
            <input name="file" type="file" className="rounded-none" id="file" />
          </div>

          <div>
            <label htmlFor="notes">Notes</label>
            <textarea
              className="bg-gray-100 border-x-0 border-t-0 border-b-2 border-solid border-gray-600 rounded-none"
              name="notes"
              id="notes"
            ></textarea>
          </div>

          <p className="italic text-sm">*Champs obligatoires</p>

          <div className="m-auto flex gap-4">
            <Button type="submit">Enregistrer</Button>
            <SecondaryLinkButton href={routes.PROJECT_DETAILS(project.id)}>
              Annuler
            </SecondaryLinkButton>
          </div>
        </form>
      </main>
    </PageTemplate>
  );
};

hydrateOnClient(SignalerDemandeAbandon);
