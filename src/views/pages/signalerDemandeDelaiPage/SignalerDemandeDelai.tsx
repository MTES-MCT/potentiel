import {
  PrimaryButton,
  SecondaryLinkButton,
  ProjectInfo,
  LegacyPageTemplate,
  ErrorBox,
  Heading1,
  TextArea,
  Radio,
  Form,
  ChampsObligatoiresLégende,
  Label,
  LabelDescription,
  Input,
} from '../../components';
import { ProjectDataForSignalerDemandeDelaiPage } from '../../../modules/project';
import routes from '../../../routes';
import { afficherDate } from '../../helpers';
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
      <Heading1 className="mb-10">Enregistrer une demande de délai traitée hors Potentiel</Heading1>
      {error && <ErrorBox title={error} />}

      <Form
        action={routes.ADMIN_SIGNALER_DEMANDE_DELAI_POST}
        method="POST"
        encType="multipart/form-data"
        className="mx-auto"
      >
        <div>
          <p className="m-0">Pour le projet</p>
          <ProjectInfo project={project}>
            <p className="m-0">
              {project.completionDueOn ? (
                <>
                  Date théorique actuelle de mise en service du projet au{' '}
                  <span className="font-bold">{afficherDate(project.completionDueOn)}</span>
                </>
              ) : (
                "Ce projet n'a pas de date théorique de mise en service."
              )}
            </p>
          </ProjectInfo>
        </div>

        <ChampsObligatoiresLégende />
        <input name="projectId" value={project.id} readOnly hidden />
        <div>
          <legend className="m-0">Décision :</legend>
          <ul className="flex flex-col lg:flex-row gap-3 my-2 p-0 list-none">
            <li>
              <Radio
                id="status-accepted"
                value="acceptée"
                name="status"
                onChange={(e) => e.target.checked && newDateImpactsProject(true)}
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
                onChange={(e) => e.target.checked && newDateImpactsProject(false)}
                required
                aria-required="true"
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
                aria-required="true"
              >
                Accord de principe
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

        {doesNewDateImpactProject && (
          <div>
            <Label htmlFor="newCompletionDueOn">Nouvelle date d'achèvement accordée</Label>
            <LabelDescription>
              Cette date impactera le projet seulement si elle est postérieure à la date théorique
              de mise en service actuelle.
            </LabelDescription>
            <Input
              type="date"
              name="newCompletionDueOn"
              id="newCompletionDueOn"
              {...(validationErrors && {
                error: validationErrors['newCompletionDueOn']?.toString(),
              })}
              required
              aria-required="true"
            />
          </div>
        )}

        <div>
          <Label htmlFor="file" optionnel>
            Courrier de la réponse (fichier joint)
          </Label>
          <Input name="file" type="file" className="rounded-none" id="file" />
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

hydrateOnClient(SignalerDemandeDelai);
