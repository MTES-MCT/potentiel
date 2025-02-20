/* eslint-disable react/jsx-props-no-spreading */
'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import React, { useState } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

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

export const ModifierLauréatForm: React.FC<ModifierLauréatFormProps> = ({
  candidature,
  lauréat,
  projet,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierLauréatEtCandidatureNotifiéeFormEntries>
  >({});

  console.log('validations', validationErrors);

  return (
    <Form
      action={modifierLauréatAction}
      heading="Modifier le lauréat"
      onValidationError={setValidationErrors}
      pendingModal={{
        id: 'form-modifier-lauréat',
        title: 'Modifier le lauréat',
        children: 'Modification du lauréat en cours...',
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
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.nomCandidat}
            label={'Nom du candidat'}
            name={'nomCandidat'}
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.emailContact}
            label={'Email de contact'}
            name={'emailContact'}
          />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.nomRepresentantLegal}
            lauréat={lauréat.nomRepresentantLegal.currentValue}
            estEnCoursDeModification={lauréat.nomRepresentantLegal.estEnCoursDeModification}
            label="Nom représentant légal"
            name="nomRepresentantLegal"
          />
        </FormRow>
        <FormRow>
          <ActionnariatField candidature={candidature.actionnariat} isPPE2={projet.isPPE2} />
        </FormRow>
        <FormRow>
          <ProjectField
            candidature={candidature.actionnaire}
            lauréat={lauréat.actionnaire.currentValue}
            estEnCoursDeModification={lauréat.actionnaire.estEnCoursDeModification}
            label="Actionnaire(s)"
            name="actionnaire"
          />
        </FormRow>
        <LocalitéField candidature={candidature} lauréat={lauréat} />
        <FormRow>
          <TechnologieField candidature={candidature.technologie} />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.prixReference}
            label={'Prix de référence'}
            name={'prixReference'}
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
              label={'Puissance (en MWc)'}
              name={'puissanceProductionAnnuelle'}
            />
            <Alert
              severity="warning"
              small
              description={
                <div className="p-3">
                  Modifier directement ce champs pour le projet est temporairement impossible pour
                  un admin
                </div>
              }
            />
          </div>
        </FormRow>
        {projet.isCRE4ZNI && (
          <FormRow>
            <PuissanceALaPointeField puissanceALaPointe={candidature.puissanceALaPointe} />
          </FormRow>
        )}
        <FormRow>
          <CandidatureField
            candidature={candidature.evaluationCarboneSimplifiee}
            label={'Evaluation carbone'}
            name={'evaluationCarboneSimplifiee'}
          />
        </FormRow>
        <FormRow>
          <CandidatureField
            candidature={candidature.noteTotale}
            label={'Note'}
            name={'noteTotale'}
          />
        </FormRow>
      </div>
    </Form>
  );
};
