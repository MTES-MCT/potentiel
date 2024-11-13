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
        Ce formulaire permet de modifier des informations qui ont changé. Pour corriger des données
        à la candidature et régénérer l'attestation, utiliser le{' '}
        <a href={Routes.Candidature.corriger(identifiantProjet)}>formulaire de modification</a> de
        la candidature
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
          <Label htmlFor="appelOffreAndPeriode">Période</Label>
          <Select
            id="appelOffreAndPeriode"
            name="appelOffreAndPeriode"
            defaultValue={
              query.appelOffreAndPeriode ||
              `${project.appelOffreId}|${project.periodeId}` ||
              'default'
            }
            disabled
          >
            <option value="default" disabled hidden>
              Choisir une période
            </option>
            {appelsOffreStatic.reduce((periodes: React.ReactNode[], appelOffre) => {
              return periodes?.concat(
                appelOffre.periodes.map((periode) => (
                  <option
                    key={`${appelOffre.id}|${periode.id}`}
                    value={`${appelOffre.id}|${periode.id}`}
                  >
                    {appelOffre.id} - {periode.id}
                  </option>
                )),
              );
            }, [] as React.ReactNode[])}
          </Select>
        </div>
        <div>
          <Label htmlFor="familleId">Famille</Label>
          <Input
            type="text"
            id="familleId"
            name="familleId"
            placeholder="Renseigner une famille"
            defaultValue={query.familleId || project.familleId || ''}
            disabled
          />
        </div>
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
          <Label htmlFor="numeroCRE">Numéro CRE</Label>
          <Input
            type="text"
            id="numeroCRE"
            name="numeroCRE"
            placeholder="Renseigner un numéro CRE"
            defaultValue={query.numeroCRE || project.numeroCRE}
            disabled
          />
        </div>
        <div>
          <Label htmlFor="nomProjet">Nom Projet</Label>
          <Input
            type="text"
            id="nomProjet"
            name="nomProjet"
            placeholder="Renseigner un nom de projet"
            defaultValue={query.nomProjet || project.nomProjet}
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
          <Label htmlFor="note">Note</Label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]+([\.,][0-9]+)?"
            name="note"
            id="note"
            placeholder="Renseigner une note"
            defaultValue={query.note || project.note}
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
        <div>
          <Label htmlFor="adresseProjet">Adresse projet (rue et numéro)</Label>
          <Input
            type="text"
            name="adresseProjet"
            id="adresseProjet"
            placeholder="Renseigner une adresse"
            defaultValue={query.adresseProjet || project.adresseProjet}
          />
        </div>
        <div>
          <Label htmlFor="codePostalProjet">Code postal projet</Label>
          <Input
            type="text"
            id="codePostalProjet"
            name="codePostalProjet"
            placeholder="Renseigner un code postal"
            defaultValue={query.codePostalProjet || project.codePostalProjet}
          />
        </div>
        <div>
          <Label htmlFor="communeProjet">Commune</Label>
          <Input
            type="text"
            id="communeProjet"
            name="communeProjet"
            placeholder="Renseigner une commune"
            defaultValue={query.communeProjet || project.communeProjet}
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
        {!project.isClasse ? (
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="isClasse">Classement</Label>
              <Select id="isClasse" name="isClasse" defaultValue={0}>
                <option value={1}>Classé</option>
                <option value={0}>Eliminé</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="motifsElimination">Motif Elimination (si éliminé)</Label>
              <Input
                type="text"
                id="motifsElimination"
                name="motifsElimination"
                defaultValue={query.motifsElimination || project.motifsElimination}
              />
            </div>
          </div>
        ) : (
          <div>
            <span>
              Classement <br /> <b>Classé</b>
            </span>
          </div>
        )}

        <PrimaryButton className="mt-2 mx-auto" type="submit" name="submit">
          Modifier
        </PrimaryButton>
      </Form>
    </Section>
  );
};
