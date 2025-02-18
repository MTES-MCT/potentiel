import { Request } from 'express';
import React from 'react';
import { appelsOffreStatic } from '../../../../dataAccess/inMemory';
import { ProjectDataForProjectPage } from '../../../../modules/project/queries';
import ROUTES from '../../../../routes';
import {
  BuildingIcon,
  PrimaryButton,
  Input,
  Label,
  Section,
  Select,
  InfoBox,
  Checkbox,
  Form,
} from '../../../components';
import { Routes } from '@potentiel-applications/routes';

type EditProjectDataProps = {
  project: ProjectDataForProjectPage;
  request: Request;
};

export const EditProjectData = ({ project, request }: EditProjectDataProps) => {
  const { query } = request as any;

  if (!project.notifiedOn || project.isAbandoned) {
    return null;
  }

  const identifiantProjet = `${project.appelOffreId}#${project.periodeId}#${project.familleId}#${project.numeroCRE}`;

  return (
    <Section title="Modifier le projet" icon={<BuildingIcon />} className="print:hidden">
      <InfoBox className="mb-5">
        Ce formulaire permet de modifier des informations qui ont changé.
        <br />
        Pour corriger des données à la candidature et régénérer l'attestation, utiliser le{' '}
        <a href={Routes.Candidature.corriger(identifiantProjet)}>formulaire de modification</a> de
        la candidature
        <br />
        {project.isClasse && (
          <>
            Pour modifier le nom ou le site de production du projet après notifiation, utiliser le{' '}
            <a href={Routes.Lauréat.modifierNomLocalité(identifiantProjet)}>
              formulaire de modification
            </a>{' '}
            du projet.
          </>
        )}
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
          <Label htmlFor="territoireProjet">Territoire</Label>
          <Input
            type="text"
            id="territoireProjet"
            name="territoireProjet"
            placeholder="Renseigner un territoire"
            defaultValue={query.territoireProjet || project.territoireProjet || ''}
          />
        </div>

        <div>
          <Label htmlFor="puissance">Puissance (en {project.appelOffre?.unitePuissance})</Label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            id="puissance"
            name="puissance"
            placeholder="Renseigner une puissance"
            defaultValue={query.puissance || project.puissance}
          />
        </div>
        <div>
          <Label htmlFor="prixReference">Prix de référence</Label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            name="prixReference"
            id="prixReference"
            placeholder="Renseigner un prix de référence"
            defaultValue={query.prixReference || project.prixReference}
          />
        </div>
        <div className="form__group">
          <Label htmlFor="evaluationCarbone">Evaluation carbone</Label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            name="evaluationCarbone"
            id="evaluationCarbone"
            placeholder="Renseigner une évaluation carbone"
            defaultValue={query.evaluationCarbone || project.evaluationCarbone}
          />
        </div>

        <div>
          <Label htmlFor="nomCandidat">Nom candidat</Label>
          <Input
            type="text"
            id="nomCandidat"
            name="nomCandidat"
            placeholder="Renseigner un nom candidat"
            defaultValue={query.nomCandidat || project.nomCandidat}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            defaultValue={query.email || project.email}
            placeholder="Renseigner un email"
          />
        </div>

        <div className="form__group flex">
          <Checkbox
            id="engagementFournitureDePuissanceAlaPointe"
            name="engagementFournitureDePuissanceAlaPointe"
            defaultChecked={
              query.engagementFournitureDePuissanceAlaPointe ||
              project.engagementFournitureDePuissanceAlaPointe
            }
          >
            Engagement de fourniture de puissance à la pointe
          </Checkbox>
        </div>
        <div>
          <Label htmlFor="participatif">Financement ou Investissement participatif</Label>
          <Select
            id="participatif"
            name="participatif"
            defaultValue={
              query.participatif ||
              (project.isFinancementParticipatif
                ? 'financement'
                : project.isInvestissementParticipatif
                  ? 'investissement'
                  : '')
            }
          >
            <option value={''}>Non</option>
            <option value={'financement'}>Financement participatif</option>
            <option value={'investissement'}>Investissement participatif</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="actionnariat">Financement collectif ou Gouvernance partagée</Label>
          <Select
            id="actionnariat"
            name="actionnariat"
            defaultValue={query.actionnariat || project.actionnariat}
          >
            <option value={''}>Non</option>
            <option value={'financement-collectif'}>Financement collectif</option>
            <option value={'gouvernance-partagee'}>Gouvernance partagée</option>
          </Select>
        </div>

        <PrimaryButton className="mt-2 mx-auto" type="submit" name="submit">
          Modifier
        </PrimaryButton>
      </Form>
    </Section>
  );
};
