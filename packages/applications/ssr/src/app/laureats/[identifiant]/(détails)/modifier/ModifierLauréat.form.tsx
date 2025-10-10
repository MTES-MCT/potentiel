'use client';

import React, { useState } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { CahierDesCharges, Lauréat } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { FormRow } from '@/components/atoms/form/FormRow';
import { Heading3 } from '@/components/atoms/headings';
import {
  ModifierCandidatureNotifiéeFormEntries,
  ModifierChampsSupplémentairesLauréatKeys,
  ModifierLauréatChampsSupplémentairesValueFormEntries,
  ModifierLauréatEtCandidatureNotifiéeFormEntries,
  ModifierLauréatKeys,
  ModifierLauréatValueFormEntries,
} from '@/utils/candidature';
import { ValidationErrors } from '@/utils/formAction';
import { FormAlertError } from '@/components/atoms/form/FormAlertError';

import { getNatureDeLExploitationTypeLabel } from '../../../../_helpers/getNatureDeLExploitationTypeLabel';
import { getActionnariatTypeLabel, getTechnologieTypeLabel } from '../../../../_helpers';

import { modifierLauréatAction } from './modifierLauréat.action';
import { ProjectField } from './components/fields/generic/ProjectField';
import { LocalitéField } from './components/fields/LocalitéField';
import { AttestationField } from './components/fields/AttestationField';
import { CandidatureField } from './components/fields/generic/CandidatureField';
import { DateDAutorisationDUrbanismeField } from './components/fields/DateDAutorisationDUrbanismeField';
import { ProjectSelectField } from './components/fields/generic/ProjectSelectField';
import { CandidatureSelectField } from './components/fields/generic/CandidatureSelectField';

type ModifierLauréatFormEntries = {
  [K in ModifierLauréatKeys]: {
    currentValue: ModifierLauréatValueFormEntries[K];
    estEnCoursDeModification: boolean;
  };
} & {
  [K in ModifierChampsSupplémentairesLauréatKeys]:
    | {
        currentValue: ModifierLauréatChampsSupplémentairesValueFormEntries[K];
        estEnCoursDeModification: boolean;
      }
    | undefined;
};

export type ModifierLauréatFormProps = {
  candidature: ModifierCandidatureNotifiéeFormEntries;
  lauréat: ModifierLauréatFormEntries & {
    statut: PlainType<Lauréat.StatutLauréat.ValueType>;
  };
  projet: {
    identifiantProjet: string;
    nomProjet: string;
    unitéPuissance: string;
  };
  cahierDesCharges: PlainType<CahierDesCharges.ValueType>;
  peutRegénérerAttestation: boolean;
};
export type FieldValidationErrors =
  ValidationErrors<ModifierLauréatEtCandidatureNotifiéeFormEntries>;

export const ModifierLauréatForm: React.FC<ModifierLauréatFormProps> = ({
  candidature,
  lauréat,
  projet,
  cahierDesCharges,
  peutRegénérerAttestation,
}) => {
  const [validationErrors, setValidationErrors] = useState<FieldValidationErrors>({});

  const cdcActuel = CahierDesCharges.bind(cahierDesCharges);
  const champsSupplémentaires = cdcActuel.getChampsSupplémentaires();

  return (
    <Form
      action={modifierLauréatAction}
      heading="Modifier le projet lauréat"
      onValidationError={setValidationErrors}
      pendingModal={{
        id: 'form-modifier-lauréat',
        title: 'Modifier le projet lauréat',
        children: 'Modification du projet lauréat en cours...',
      }}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
          href: Routes.Projet.details(projet.identifiantProjet),
        },
      }}
    >
      {!peutRegénérerAttestation && (
        <Alert
          severity="info"
          small
          description={
            <div className="p-1">
              La période de l'appel d'offre de ce projet ne dispose pas de modèle d'attestation de
              désignation, il est donc impossible de regénérer l'attestation existante.
            </div>
          }
        />
      )}
      <div className="flex flex-col gap-4">
        <FormRow>
          <div className="flex-1">
            <Heading3>Champs à modifier</Heading3>
          </div>
          <div className="flex-[2] text-center">
            <Heading3>Valeur à la candidature</Heading3>
          </div>
          <div className="flex-[2] text-center">
            <Heading3>Valeur actuelle (lauréat)</Heading3>
          </div>
        </FormRow>
        <input type={'hidden'} value={projet.identifiantProjet} name="identifiantProjet" />
        {validationErrors['identifiantProjet'] && (
          <FormAlertError description={validationErrors['identifiantProjet']} />
        )}
        <FormRow>
          <ProjectField
            candidature={candidature.nomProjet}
            lauréat={lauréat.nomProjet.currentValue}
            estEnCoursDeModification={lauréat.nomProjet.estEnCoursDeModification}
            label="Nom du projet"
            name="nomProjet"
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.nomCandidat}
            lauréat={lauréat.nomCandidat.currentValue}
            label="Nom du producteur"
            name="nomCandidat"
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.emailContact}
            label="Email de contact"
            name="emailContact"
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.nomRepresentantLegal}
            lauréat={lauréat.nomRepresentantLegal.currentValue}
            estEnCoursDeModification={lauréat.nomRepresentantLegal.estEnCoursDeModification}
            label="Nom du représentant légal"
            name="nomRepresentantLegal"
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <FormRow>
          <CandidatureSelectField
            candidature={candidature.actionnariat ?? ''}
            label="Type d'actionnariat"
            name="actionnariat"
            options={[
              { label: 'Aucun', value: '' },
              ...cdcActuel.getTypesActionnariat().map((type) => ({
                label: getActionnariatTypeLabel(type),
                value: type,
              })),
            ]}
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.actionnaire}
            lauréat={lauréat.actionnaire.currentValue}
            estEnCoursDeModification={lauréat.actionnaire.estEnCoursDeModification}
            label="Actionnaire(s)"
            name="actionnaire"
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <LocalitéField
          candidature={candidature}
          lauréat={lauréat}
          validationErrors={validationErrors}
        />
        <FormRow>
          <CandidatureSelectField
            candidature={candidature.technologie}
            label="Technologie"
            name="technologie"
            options={Candidature.TypeTechnologie.types.map((type) => ({
              value: type,
              label: getTechnologieTypeLabel(type),
            }))}
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.prixReference}
            label="Prix de référence"
            name="prixReference"
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.puissanceProductionAnnuelle}
            lauréat={lauréat.puissanceProductionAnnuelle.currentValue}
            estEnCoursDeModification={lauréat.puissanceProductionAnnuelle.estEnCoursDeModification}
            label={`Puissance (en ${projet.unitéPuissance})`}
            name="puissanceProductionAnnuelle"
            validationErrors={validationErrors}
            nativeInputProps={{
              step: 0.1,
            }}
            required
          />
        </FormRow>
        {champsSupplémentaires.puissanceALaPointe && (
          <FormRow>
            <CandidatureSelectField
              candidature={candidature.puissanceALaPointe ? 'true' : 'false'}
              label="Puissance à la pointe"
              name="puissanceALaPointe"
              options={[
                { label: 'Oui', value: 'true' },
                { label: 'Non', value: 'false' },
              ]}
              validationErrors={validationErrors}
              required={champsSupplémentaires.puissanceALaPointe === 'requis'}
            />
          </FormRow>
        )}

        {champsSupplémentaires.puissanceDeSite && (
          <FormRow>
            <CandidatureField
              candidature={candidature.puissanceDeSite ?? 0}
              label={`Puissance de site (en ${projet.unitéPuissance})`}
              name="puissanceDeSite"
              validationErrors={validationErrors}
              required={champsSupplémentaires.puissanceDeSite === 'requis'}
            />
          </FormRow>
        )}
        {champsSupplémentaires.autorisationDUrbanisme && (
          <>
            <FormRow>
              <CandidatureField
                candidature={candidature.numeroDAutorisationDUrbanisme ?? ''}
                label="Numéro d'autorisation d'urbanisme"
                name="numeroDAutorisationDUrbanisme"
                validationErrors={validationErrors}
                required={champsSupplémentaires.autorisationDUrbanisme === 'requis'}
              />
            </FormRow>
            <FormRow>
              <DateDAutorisationDUrbanismeField
                value={candidature.dateDAutorisationDUrbanisme ?? ''}
                validationErrors={validationErrors}
              />
            </FormRow>
          </>
        )}
        {champsSupplémentaires.installateur && lauréat.installateur && (
          <FormRow>
            <ProjectField
              candidature={candidature.installateur}
              lauréat={lauréat.installateur.currentValue}
              label="Installateur"
              name="installateur"
              validationErrors={validationErrors}
              required={champsSupplémentaires.installateur === 'requis'}
            />
          </FormRow>
        )}
        {champsSupplémentaires.installationAvecDispositifDeStockage && (
          <FormRow>
            <ProjectSelectField
              name="installationAvecDispositifDeStockage"
              label="Dispositif de stockage"
              candidature={candidature.installationAvecDispositifDeStockage ? 'true' : 'false'}
              lauréat={lauréat.installationAvecDispositifDeStockage ? 'true' : 'false'}
              options={[
                { label: 'Avec', value: 'true' },
                { label: 'Sans', value: 'false' },
              ]}
              validationErrors={validationErrors}
              required={champsSupplémentaires.installationAvecDispositifDeStockage === 'requis'}
            />
          </FormRow>
        )}
        {champsSupplémentaires.natureDeLExploitation && (
          <FormRow>
            <ProjectSelectField
              name="natureDeLExploitation"
              label="Nature de l'exploitation"
              candidature={candidature.natureDeLExploitation}
              lauréat={lauréat.natureDeLExploitation?.currentValue}
              options={Lauréat.NatureDeLExploitation.TypeDeNatureDeLExploitation.types.map(
                (type) => ({
                  label: getNatureDeLExploitationTypeLabel(type),
                  value: type,
                }),
              )}
              validationErrors={validationErrors}
              required={champsSupplémentaires.natureDeLExploitation === 'requis'}
            />
          </FormRow>
        )}
        {champsSupplémentaires.coefficientKChoisi && (
          <FormRow>
            <CandidatureSelectField
              candidature={candidature.coefficientKChoisi ? 'true' : 'false'}
              label="Choix du coefficient K"
              name="coefficientKChoisi"
              options={[
                { label: 'Oui', value: 'true' },
                { label: 'Non', value: 'false' },
              ]}
              validationErrors={validationErrors}
              required={champsSupplémentaires.coefficientKChoisi === 'requis'}
            />
          </FormRow>
        )}

        <FormRow>
          <ProjectField
            candidature={candidature.evaluationCarboneSimplifiee}
            lauréat={lauréat.evaluationCarboneSimplifiee.currentValue}
            label="Evaluation carbone"
            name="evaluationCarboneSimplifiee"
            validationErrors={validationErrors}
            estEnCoursDeModification={lauréat.evaluationCarboneSimplifiee.estEnCoursDeModification}
            required
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.noteTotale}
            label="Note"
            name="noteTotale"
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        {peutRegénérerAttestation ? (
          <FormRow>
            <AttestationField validationErrors={validationErrors} />
          </FormRow>
        ) : (
          <input type="hidden" name="doitRegenererAttestation" value="false" />
        )}
      </div>
    </Form>
  );
};
