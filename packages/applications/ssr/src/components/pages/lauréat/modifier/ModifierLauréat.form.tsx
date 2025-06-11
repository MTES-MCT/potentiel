'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import React, { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { FormRow } from '@/components/atoms/form/FormRow';
import { Heading3 } from '@/components/atoms/headings';
import {
  ModifierCandidatureNotifiéeFormEntries,
  ModifierLauréatEtCandidatureNotifiéeFormEntries,
  ModifierLauréatKeys,
  ModifierLauréatValueFormEntries,
} from '@/utils/candidature';
import { ValidationErrors } from '@/utils/formAction';

import { FormAlertError } from '../../../atoms/form/FormAlertError';

import { modifierLauréatAction } from './modifierLauréat.action';
import { ProjectField } from './components/fields/ProjectField';
import { TechnologieField } from './components/fields/TechnologieField';
import { ActionnariatField } from './components/fields/ActionnariatField';
import { LocalitéField } from './components/fields/LocalitéField';
import { PuissanceALaPointeField } from './components/fields/PuissanceALaPointeField ';
import { AttestationField } from './components/fields/AttestationField';
import { CandidatureField } from './components/fields/CandidatureField';
import { CoefficientKField } from './components/fields/CoefficientKField';

type ModifierLauréatFormEntries = {
  [K in ModifierLauréatKeys]: {
    currentValue: ModifierLauréatValueFormEntries[K];
    estEnCoursDeModification: boolean;
  };
};

export type ModifierLauréatFormProps = {
  candidature: ModifierCandidatureNotifiéeFormEntries;
  lauréat: ModifierLauréatFormEntries;
  projet: {
    identifiantProjet: string;
    nomProjet: string;
    isPPE2: boolean;
    unitéPuissance: string;
  };
  champsSpéciaux: {
    puissanceALaPointe: boolean;
    coefficientKChoisi: boolean;
  };
};
export type FieldValidationErrors =
  ValidationErrors<ModifierLauréatEtCandidatureNotifiéeFormEntries>;

export const ModifierLauréatForm: React.FC<ModifierLauréatFormProps> = ({
  candidature,
  lauréat,
  projet,
  champsSpéciaux,
}) => {
  const [validationErrors, setValidationErrors] = useState<FieldValidationErrors>({});

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
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(projet.identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au projet
          </Button>
          <SubmitButton>Modifier</SubmitButton>
        </>
      }
    >
      <div className="flex flex-col gap-4 mt-4">
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
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.nomCandidat}
            lauréat={lauréat.nomCandidat.currentValue}
            label="Nom du producteur"
            name="nomCandidat"
            validationErrors={validationErrors}
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.emailContact}
            label="Email de contact"
            name="emailContact"
            validationErrors={validationErrors}
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.nomRepresentantLegal}
            lauréat={lauréat.nomRepresentantLegal.currentValue}
            estEnCoursDeModification={lauréat.nomRepresentantLegal.estEnCoursDeModification}
            label="Nom représentant légal"
            name="nomRepresentantLegal"
            validationErrors={validationErrors}
          />
        </FormRow>
        <FormRow>
          <ActionnariatField
            candidature={candidature.actionnariat ?? ''}
            label="Type d'actionnariat (optionnel)"
            name="actionnariat"
            isPPE2={projet.isPPE2}
            validationErrors={validationErrors}
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.actionnaire}
            lauréat={lauréat.actionnaire.currentValue}
            estEnCoursDeModification={lauréat.actionnaire.estEnCoursDeModification}
            label="Actionnaire(s) (optionnel)"
            name="actionnaire"
            validationErrors={validationErrors}
          />
        </FormRow>
        <LocalitéField
          candidature={candidature}
          lauréat={lauréat}
          validationErrors={validationErrors}
        />
        <FormRow>
          <TechnologieField
            candidature={candidature.technologie}
            name="technologie"
            label="Technologie"
            validationErrors={validationErrors}
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.prixReference}
            label="Prix de référence"
            name="prixReference"
            validationErrors={validationErrors}
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
          />
        </FormRow>
        {champsSpéciaux.puissanceALaPointe && (
          <FormRow>
            <PuissanceALaPointeField
              candidature={candidature.puissanceALaPointe}
              name="puissanceALaPointe"
              label="Engagement de puissance à la pointe"
              validationErrors={validationErrors}
            />
          </FormRow>
        )}

        {champsSpéciaux.coefficientKChoisi && (
          <FormRow>
            <CoefficientKField
              candidature={candidature.coefficientKChoisi ?? false}
              label="Choix du coefficient K"
              name="coefficientKChoisi"
              validationErrors={validationErrors}
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
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.noteTotale}
            label="Note"
            name="noteTotale"
            validationErrors={validationErrors}
          />
        </FormRow>
        <FormRow>
          <AttestationField validationErrors={validationErrors} />
        </FormRow>
      </div>
    </Form>
  );
};
