'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import React, { useState } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { FormRow } from '@/components/atoms/form/FormRow';
import { Heading3 } from '@/components/atoms/headings';
import { ModifierLauréatEtCandidatureNotifiéeFormEntries } from '@/utils/zod/candidature';

import { ValidationErrors } from '../../../../utils/formAction';

import { modifierLauréatAction } from './modifierLauréat.action';
import { ModifierLauréatPageProps } from './ModifierLauréat.page';
import { CandidatureField, ProjectField } from './fields/ModifierLauréatFields';
import { TechnologieField } from './fields/TechnologieField';
import { ActionnariatField } from './fields/ActionnariatField';
import { LocalitéField } from './fields/LocalitéField';
import { PuissanceALaPointeField } from './fields/PuissanceALaPointeField ';

export type ModifierLauréatFormProps = ModifierLauréatPageProps;
export type FieldValidationErrors =
  ValidationErrors<ModifierLauréatEtCandidatureNotifiéeFormEntries>;

export const ModifierLauréatForm: React.FC<ModifierLauréatFormProps> = ({
  candidature,
  lauréat,
  projet,
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
          <CandidatureField
            candidature={candidature.nomCandidat}
            label="Nom du candidat"
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
          <div className="flex flex-col gap-2 w-full">
            <ProjectField
              candidature={candidature.puissanceProductionAnnuelle}
              lauréat={lauréat.puissanceProductionAnnuelle.currentValue}
              estEnCoursDeModification={
                lauréat.puissanceProductionAnnuelle.estEnCoursDeModification
              }
              label="Puissance (en MWc)"
              name="puissanceProductionAnnuelle"
              validationErrors={validationErrors}
            />
            <Alert
              className="md:ml-64 md:mr-2"
              severity="warning"
              small
              description={
                <span>
                  Pour un changement sur la puissance du projet, veuillez utiliser le formulaire{' '}
                  <Link href={Routes.Projet.details(projet.identifiantProjet)}>dédié</Link>.
                </span>
              }
            />
          </div>
        </FormRow>
        {projet.isCRE4ZNI && (
          <FormRow>
            <PuissanceALaPointeField
              candidature={candidature.puissanceALaPointe}
              name="puissanceALaPointe"
              label="Engagement de puissance à la pointe"
              validationErrors={validationErrors}
            />
          </FormRow>
        )}
        <FormRow>
          <CandidatureField
            candidature={candidature.evaluationCarboneSimplifiee}
            label="Evaluation carbone"
            name="evaluationCarboneSimplifiee"
            validationErrors={validationErrors}
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
      </div>
    </Form>
  );
};
