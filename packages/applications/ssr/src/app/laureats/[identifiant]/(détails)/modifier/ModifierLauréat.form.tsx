'use client';

import React, { useState } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

import { CahierDesCharges, Lauréat } from '@potentiel-domain/projet';
import { Candidature } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { FormRow } from '@/components/atoms/form/FormRow';
import { Heading3 } from '@/components/atoms/headings';
import {
  ModifierCandidatureNotifiéeFormEntries,
  ModifierLauréatEtCandidatureNotifiéeFormEntries,
  ModifierLauréatKeys,
  ModifierLauréatValueFormEntries,
} from '@/utils/candidature';
import { ValidationErrors } from '@/utils/formAction';
import { FormAlertError } from '@/components/atoms/form/FormAlertError';
import { Icon } from '@/components/atoms/Icon';
import { getActionnariatTypeLabel, getTechnologieTypeLabel } from '@/app/_helpers';

import { modifierLauréatAction } from './modifierLauréat.action';
import { ProjectField } from './components/fields/generic/ProjectField';
import { LocalitéField } from './components/fields/LocalitéField';
import { AttestationField } from './components/fields/AttestationField';
import { CandidatureField } from './components/fields/generic/CandidatureField';
import { CandidatureSelectField } from './components/fields/generic/CandidatureSelectField';
import { DateDAutorisationField } from './components/fields/DateDAutorisation';

type ModifierLauréatFormEntries = {
  [K in ModifierLauréatKeys]: {
    currentValue: ModifierLauréatValueFormEntries[K];
    estEnCoursDeModification: boolean;
  };
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
            label={
              <>
                Email de contact{' '}
                <Tooltip
                  kind="hover"
                  title="La modification de l'email entraînera la mise à jour des comptes ayant accès au projet"
                >
                  <Icon id="ri-information-line" />
                </Tooltip>
              </>
            }
            name="emailContact"
            validationErrors={validationErrors}
            required
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.nomReprésentantLégal}
            lauréat={lauréat.nomReprésentantLégal.currentValue}
            estEnCoursDeModification={lauréat.nomReprésentantLégal.estEnCoursDeModification}
            label="Nom du représentant légal"
            name="nomReprésentantLégal"
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
            candidature={candidature.sociétéMère}
            lauréat={lauréat.sociétéMère.currentValue}
            estEnCoursDeModification={lauréat.sociétéMère.estEnCoursDeModification}
            label="Actionnaire(s)"
            name="sociétéMère"
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
            candidature={candidature.puissance}
            lauréat={lauréat.puissance.currentValue}
            estEnCoursDeModification={lauréat.puissance.estEnCoursDeModification}
            label={`Puissance installée (en ${projet.unitéPuissance})`}
            name="puissance"
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
            <ProjectField
              candidature={candidature.puissanceDeSite ?? 0}
              label={`Puissance de site (en ${projet.unitéPuissance})`}
              name="puissanceDeSite"
              lauréat={lauréat.puissanceDeSite.currentValue}
              validationErrors={validationErrors}
              required={champsSupplémentaires.puissanceDeSite === 'requis'}
            />
          </FormRow>
        )}
        {champsSupplémentaires.autorisation && (
          <>
            <FormRow>
              <CandidatureField
                candidature={candidature.numéroDAutorisation ?? ''}
                label="Numéro d'autorisation"
                name="numéroDAutorisation"
                validationErrors={validationErrors}
                required={champsSupplémentaires.autorisation === 'requis'}
              />
            </FormRow>
            <FormRow>
              <DateDAutorisationField
                value={candidature.dateDAutorisation ?? ''}
                validationErrors={validationErrors}
              />
            </FormRow>
          </>
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
            candidature={candidature.evaluationCarboneSimplifiée}
            lauréat={lauréat.evaluationCarboneSimplifiée.currentValue}
            label="Evaluation carbone"
            name="evaluationCarboneSimplifiée"
            validationErrors={validationErrors}
            estEnCoursDeModification={lauréat.evaluationCarboneSimplifiée.estEnCoursDeModification}
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
