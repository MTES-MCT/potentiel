import {
  PrimaryButton,
  Input,
  SecondaryLinkButton,
  ProjectInfo,
  LegacyPageTemplate,
  Astérisque,
  FormulaireChampsObligatoireLégende,
  ErrorBox,
  Heading1,
  TextArea,
  Radio,
  Form,
} from '@components';
import { ProjectDataForSignalerDemandeDelaiPage } from '@modules/project';
import routes from '@routes';
import { afficherDate } from '@views/helpers';
import { Request } from 'express';
import React, { useState } from 'react';
import { hydrateOnClient } from '../../helpers/hydrateOnClient';

type SignalerDemandeDelaiProps = {
  request: Request;
  project: ProjectDataForSignalerDemandeDelaiPage;
  validationErrors?: Array<{ [fieldName: string]: string }>;
};
export const SignalerDemandeDelai = ({
  request,
  project,
  validationErrors,
}: SignalerDemandeDelaiProps) => {
  const { user } = request;
  const { error } = (request.query as any) || {};
  const [doesNewDateImpactProject, newDateImpactsProject] = useState(true);

  return (
    <LegacyPageTemplate user={user} currentPage="list-projects">
      <Heading1>Enregistrer une demande de délai traitée hors Potentiel</Heading1>
      {error && <ErrorBox title={error} />}

      <Form
        action={routes.ADMIN_SIGNALER_DEMANDE_DELAI_POST}
        method="POST"
        encType="multipart/form-data"
        className="mx-auto"
      >
        <div>
          <FormulaireChampsObligatoireLégende className="text-right" />
          <p className="m-0">Pour le projet</p>
          <ProjectInfo project={project}>
            <p className="m-0">
              {project.completionDueOn ? (
                <>
                  Date théorique actuelle de mise en service du projet au{' '}
                  <span className="font-bold">{afficherDate(project.completionDueOn)}</span>
                </>
              ) : (
                <>Ce projet n'a pas de date théorique de mise en service.</>
              )}
            </p>
          </ProjectInfo>
        </div>

        <input name="projectId" value={project.id} readOnly hidden />

        <div>
          <legend className="m-0">
            Décision <Astérisque /> :
          </legend>
          <ul className="flex flex-col lg:flex-row gap-3 my-2 p-0 list-none">
            <li>
              <Radio
                id="status-accepted"
                value="acceptée"
                name="status"
                onChange={(e) => e.target.checked && newDateImpactsProject(true)}
                defaultChecked
                required
              >
                Demande acceptée
              </Radio>
            </li>
            <li>
              <Radio
                id="status-rejected"
                value="rejetée"
                name="status"
                onChange={(e) => e.target.checked && newDateImpactsProject(false)}
                required
              >
                Demande rejetée
              </Radio>
            </li>
            <li>
              <Radio
                id="status-accord-principe"
                value="accord-de-principe"
                name="status"
                onChange={(e) => e.target.checked && newDateImpactsProject(false)}
                required
              >
                Accord de principe
              </Radio>
            </li>
          </ul>
        </div>

        <div>
          <label htmlFor="decidedOn">
            Date de la décision (=date du courrier) <Astérisque />
          </label>
          <Input
            type="date"
            name="decidedOn"
            id="decidedOn"
            required
            {...(validationErrors && { error: validationErrors['decidedOn']?.toString() })}
          />
        </div>

        {doesNewDateImpactProject && (
          <div>
            <label htmlFor="newCompletionDueOn">
              Nouvelle date d'achèvement accordée <Astérisque />
            </label>
            <Input
              type="date"
              name="newCompletionDueOn"
              id="newCompletionDueOn"
              required
              {...(validationErrors && {
                error: validationErrors['newCompletionDueOn']?.toString(),
              })}
            />
            <p className="m-0 italic">
              Cette date impactera le projet seulement si elle est postérieure à la date théorique
              de mise en service actuelle.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="file">Courrier de la réponse (fichier joint)</label>
          <input name="file" type="file" className="rounded-none" id="file" />
        </div>

        <div>
          <label htmlFor="notes">Notes</label>
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

hydrateOnClient(SignalerDemandeDelai);
