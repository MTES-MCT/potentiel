import { Request } from 'express';
import React from 'react';
import { ProjectDataForProjectPage } from '../../../../modules/project/queries';
import ROUTES from '../../../../routes';
import {
  BuildingIcon,
  PrimaryButton,
  Input,
  Label,
  Section,
  InfoBox,
  Form,
} from '../../../components';
import { Routes } from '@potentiel-applications/routes';

type EditProjectDataProps = {
  project: ProjectDataForProjectPage;
  request: Request;
};

export const EditProjectData = ({ project, request }: EditProjectDataProps) => {
  if (!project.notifiedOn || project.isAbandoned) {
    return null;
  }

  const identifiantProjet = `${project.appelOffreId}#${project.periodeId}#${project.familleId}#${project.numeroCRE}`;

  return (
    <Section title="Modifier le projet" icon={<BuildingIcon />} className="print:hidden">
      <InfoBox className="mb-5">
        Ce formulaire est accessible temporairement pour modifier la puissance du projet.
        <br />
        <br />
        {project.notifiedOn && project.isClasse && (
          <>
            Pour modifier la candidature et le projet <b>après notification</b>, utiliser le{' '}
            <a href={Routes.Lauréat.modifier(identifiantProjet)}>formulaire de modification</a> du
            projet.
          </>
        )}
        <br />
        Pour corriger des données à la candidature et régénérer l'attestation, utiliser le{' '}
        <a href={Routes.Candidature.corriger(identifiantProjet)}>formulaire de modification</a> de
        la candidature.
        <br />
        <br />
      </InfoBox>
      <Form
        action={ROUTES.ADMIN_CORRECT_PROJECT_DATA_ACTION}
        method="post"
        encType="multipart/form-data"
        className="mx-auto"
      >
        <input type="hidden" name="projectId" value={project.id} />
        <input
          type="hidden"
          name="projectVersionDate"
          value={new Date(project.updatedAt || 0).getTime()}
        />

        <div>
          <Label htmlFor="puissance">Puissance (en {project.appelOffre?.unitePuissance})</Label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            id="puissance"
            name="puissance"
            placeholder="Renseigner une puissance"
            defaultValue={project.puissance}
          />
        </div>

        <PrimaryButton className="mt-2 mx-auto" type="submit" name="submit">
          Modifier
        </PrimaryButton>
      </Form>
    </Section>
  );
};
