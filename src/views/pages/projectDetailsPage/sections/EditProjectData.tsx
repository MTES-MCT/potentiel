import { Request } from 'express';
import React, { useState } from 'react';
import { appelsOffreStatic } from '@dataAccess/inMemory';
import { dataId } from '../../../../helpers/testId';
import { ProjectDataForProjectPage } from '@modules/project/queries';
import ROUTES from '@routes';
import {
  BuildingIcon,
  PrimaryButton,
  Input,
  InputCheckbox,
  Label,
  Section,
  Select,
  TextArea,
} from '@components';
import { afficherDate } from '@views/helpers';

type EditProjectDataProps = {
  project: ProjectDataForProjectPage;
  request: Request;
};

export const EditProjectData = ({ project, request }: EditProjectDataProps) => {
  const { query } = request as any;

  if (!project.notifiedOn || project.isAbandoned) {
    return null;
  }

  const [uploadIsDisabled, disableUpload] = useState(true);

  const handleCertificateTypeChange = (e) => {
    disableUpload(e.target.value !== 'custom');
  };

  return (
    <Section title="Modifier le projet" icon={BuildingIcon}>
      <form
        action={ROUTES.ADMIN_CORRECT_PROJECT_DATA_ACTION}
        method="post"
        encType="multipart/form-data"
      >
        <input type="hidden" name="projectId" value={project.id} />
        <input
          type="hidden"
          name="projectVersionDate"
          value={new Date(project.updatedAt || 0).getTime()}
        />
        <div className="form__group">
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
        <div className="form__group">
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
        <div className="form__group">
          <Label htmlFor="territoireProjet">Territoire</Label>
          <Input
            type="text"
            id="territoireProjet"
            name="territoireProjet"
            placeholder="Renseigner un territoire"
            defaultValue={query.territoireProjet || project.territoireProjet || ''}
          />
        </div>
        <div className="form__group">
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
        <div className="form__group">
          <Label htmlFor="nomProjet">Nom Projet</Label>
          <Input
            type="text"
            id="nomProjet"
            name="nomProjet"
            placeholder="Renseigner un nom de projet"
            defaultValue={query.nomProjet || project.nomProjet}
          />
        </div>
        <div className="form__group">
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
        <div className="form__group">
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
        <div className="form__group">
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
        <div className="form__group">
          <Label htmlFor="nomCandidat">Nom candidat</Label>
          <Input
            type="text"
            id="nomCandidat"
            name="nomCandidat"
            placeholder="Renseigner un nom candidat"
            defaultValue={query.nomCandidat || project.nomCandidat}
          />
        </div>
        <div className="form__group">
          <Label htmlFor="nomRepresentantLegal">Nom représentant légal</Label>
          <Input
            type="text"
            name="nomRepresentantLegal"
            id="nomRepresentantLegal"
            placeholder="Renseigner un nom de représentant légal"
            defaultValue={query.nomRepresentantLegal || project.nomRepresentantLegal}
          />
        </div>
        <div className="form__group">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            defaultValue={query.email || project.email}
            placeholder="Renseigner un email"
          />
        </div>
        <div className="form__group">
          <Label htmlFor="adresseProjet">Adresse projet (rue et numéro)</Label>
          <Input
            type="text"
            name="adresseProjet"
            id="adresseProjet"
            placeholder="Renseigner une adresse"
            defaultValue={query.adresseProjet || project.adresseProjet}
          />
        </div>
        <div className="form__group">
          <Label htmlFor="codePostalProjet">Code postal projet</Label>
          <Input
            type="text"
            id="codePostalProjet"
            name="codePostalProjet"
            placeholder="Renseigner un code postal"
            defaultValue={query.codePostalProjet || project.codePostalProjet}
          />
        </div>
        <div className="form__group">
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
          <InputCheckbox
            id="engagementFournitureDePuissanceAlaPointe"
            name="engagementFournitureDePuissanceAlaPointe"
            defaultChecked={
              query.engagementFournitureDePuissanceAlaPointe ||
              project.engagementFournitureDePuissanceAlaPointe
            }
          />
          <Label htmlFor="engagementFournitureDePuissanceAlaPointe">
            Engagement de fourniture de puissance à la pointe
          </Label>
        </div>
        <div className="form__group">
          <Label htmlFor="participatif">Financement/Investissement participatif</Label>
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
        {!project.isClasse ? (
          <>
            <div className="form__group">
              <Label htmlFor="isClasse">Classement</Label>
              <Select id="isClasse" name="isClasse" defaultValue={0}>
                <option value={1}>Classé</option>
                <option value={0}>Eliminé</option>
              </Select>
            </div>
            <div className="form__group">
              <Label htmlFor="motifsElimination">Motif Elimination (si éliminé)</Label>
              <Input
                type="text"
                id="motifsElimination"
                name="motifsElimination"
                defaultValue={query.motifsElimination || project.motifsElimination}
              />
            </div>
          </>
        ) : (
          <div className="form__group">
            <span>
              Classement <br /> <b>Classé</b>
            </span>
          </div>
        )}

        {!project.isLegacy && (
          <div className="form__group">
            <Label htmlFor="notificationDate">Date désignation (format JJ/MM/AAAA)</Label>
            <Input
              type="text"
              name="notificationDate"
              id="notificationDate"
              {...dataId('date-field')}
              defaultValue={
                query.notificationDate ||
                (project.notifiedOn && afficherDate(new Date(project.notifiedOn)))
              }
              placeholder="Renseigner une date de désignation"
              style={{ width: 'auto' }}
            />
            <div
              className="notification error"
              style={{ display: 'none' }}
              {...dataId('error-message-wrong-format')}
            >
              Le format de la date saisie n’est pas conforme. Elle doit être de la forme JJ/MM/AAAA
              soit par exemple 25/05/2022 pour 25 Mai 2022.
            </div>
          </div>
        )}

        {!project.isLegacy && (
          <div className="form__group">
            Attestation de désignation
            <div className="inline-radio-option">
              <input
                type="radio"
                name="attestation"
                id="regenerate"
                value="regenerate"
                defaultChecked
                onChange={handleCertificateTypeChange}
              />
              <Label htmlFor="regenerate">
                Regénérer l'attestation (si les données du projet ont changé)
              </Label>
            </div>
            <div className="inline-radio-option">
              <input
                type="radio"
                name="attestation"
                id="donotregenerate"
                value="donotregenerate"
                onChange={handleCertificateTypeChange}
              />
              <Label htmlFor="donotregenerate">Ne pas regénérer l'attestation</Label>
            </div>
            <div className="inline-radio-option">
              <input
                type="radio"
                name="attestation"
                id="custom"
                value="custom"
                onChange={handleCertificateTypeChange}
              />
              <Label htmlFor="custom">Uploader une attestation</Label>
            </div>
            <Input type="file" name="file" id="file" disabled={uploadIsDisabled} />
          </div>
        )}
        <div className="form__group">
          <Label htmlFor="reason">Message justificatif du changement (facultatif)</Label>
          <TextArea
            name="reason"
            id="reason"
            defaultValue={query.reason}
            placeholder="Renseigner un message justifcatif du changement"
          />
        </div>
        <PrimaryButton className="mt-2" type="submit" name="submit" {...dataId('submit-button')}>
          Modifier
        </PrimaryButton>
      </form>
    </Section>
  );
};
