'use client';

import React from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { z } from 'zod';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/candidature';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { candidatureSchema } from '../importer/candidature.schema';

import {
  corrigerCandidatureAction,
  CorrigerCandidatureFormEntries,
} from './corrigerCandidature.action';

export type CorrigerCandidatureFormProps = {
  candidature: CorrigerCandidatureFormEntries;
  estNotifiée: boolean;
};

export const CorrigerCandidatureForm: React.FC<CorrigerCandidatureFormProps> = ({
  candidature,
  estNotifiée,
}) => {
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationErrors<keyof CorrigerCandidatureFormEntries>
  >({});

  const [showMotifÉlimination, setShowMotifÉlimination] = React.useState(
    candidature.statut === 'éliminé',
  );

  const getStateProps = (field: keyof z.infer<typeof candidatureSchema>) => ({
    state: validationErrors[field] ? ('error' as const) : ('default' as const),
    stateRelatedMessage: validationErrors[field],
  });
  const getFieldProps = (field: keyof z.infer<typeof candidatureSchema>) => ({
    name: encodeURIComponent(field),
    defaultValue: candidature[field] !== undefined ? String(candidature[field]) : undefined,
  });

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={corrigerCandidatureAction}
      heading="Corriger la candidature"
      pendingModal={{
        id: 'form-corriger-candidatures',
        title: 'Corriger la candidature',
        children: 'Correction de la candidature en cours...',
      }}
      onValidationError={setValidationErrors}
      successMessage={'candidature corrigée'}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Candidature.détails(candidature.identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour à la candidature
          </Button>
          <SubmitButton>Corriger</SubmitButton>
        </>
      }
    >
      <input name="identifiantProjet" type="hidden" value={candidature.identifiantProjet} />
      <Select
        {...getStateProps('statut')}
        label="Statut"
        options={[
          { label: 'Classé', value: 'classé' },
          { label: 'Éliminé', value: 'éliminé' },
        ]}
        nativeSelectProps={{
          ...getFieldProps('statut'),
          onChange: (e) => setShowMotifÉlimination(e.target.value === 'éliminé'),
        }}
        disabled={estNotifiée}
      />
      {showMotifÉlimination && (
        <Input
          textArea
          {...getStateProps('motifElimination')}
          label="Motif élimination"
          nativeTextAreaProps={getFieldProps('motifElimination')}
        />
      )}
      <Input
        {...getStateProps('nomProjet')}
        label="Nom du projet"
        nativeInputProps={getFieldProps('nomProjet')}
      />
      <Input
        {...getStateProps('nomCandidat')}
        label="Nom du candidat"
        nativeInputProps={getFieldProps('nomCandidat')}
      />
      <Input
        {...getStateProps('emailContact')}
        label="Email"
        nativeInputProps={getFieldProps('emailContact')}
      />
      <Input
        {...getStateProps('nomRepresentantLegal')}
        label="Nom complet du représentant légal"
        nativeInputProps={getFieldProps('nomRepresentantLegal')}
      />
      <Select
        {...getStateProps('actionnariat')}
        label="Actionnariat (optionnel)"
        options={[
          { label: '', value: '' },
          {
            label: 'Financement Collectif',
            value: Candidature.TypeActionnariat.financementCollectif.type,
          },
          {
            label: 'Gouvernance Partagée',
            value: Candidature.TypeActionnariat.gouvernancePartagée.type,
          },
        ]}
        nativeSelectProps={{ ...getFieldProps('actionnariat'), 'aria-required': false }}
      />
      <Input
        {...getStateProps('societeMere')}
        label="Société Mère (optionnel)"
        nativeInputProps={{ ...getFieldProps('societeMere'), 'aria-required': false }}
      />
      <Input
        {...getStateProps('adresse1')}
        label="Adresse 1"
        nativeInputProps={getFieldProps('adresse1')}
      />
      <Input
        {...getStateProps('adresse2')}
        label="Adresse 2 (optionnel)"
        nativeInputProps={{ ...getFieldProps('adresse2'), 'aria-required': false }}
      />
      <Input
        {...getStateProps('codePostal')}
        label="Code Postal"
        nativeInputProps={getFieldProps('codePostal')}
      />
      <Input
        {...getStateProps('commune')}
        label="Commune"
        nativeInputProps={getFieldProps('commune')}
      />
      <Select
        {...getStateProps('technologie')}
        label="Technologie"
        nativeSelectProps={getFieldProps('technologie')}
        options={[
          { label: 'PV', value: 'pv' },
          { label: 'Éolien', value: 'eolien' },
          { label: 'Hydraulique', value: 'hydraulique' },
          { label: 'N/A', value: 'N/A' },
        ]}
      />
      <Input
        {...getStateProps('prixReference')}
        label="Prix de référence"
        nativeInputProps={getFieldProps('prixReference')}
      />
      <Input
        {...getStateProps('puissanceProductionAnnuelle')}
        label="Puissance (en MWc)"
        nativeInputProps={getFieldProps('puissanceProductionAnnuelle')}
      />
      <Checkbox
        {...getStateProps('puissanceALaPointe')}
        id="puissanceALaPointe"
        options={[
          {
            label: 'Engagement de fourniture de puissance à la pointe',
            nativeInputProps: {
              ...getFieldProps('puissanceALaPointe'),
              value: 'true',
              defaultChecked: candidature.puissanceALaPointe,
            },
          },
        ]}
      />
      <Input
        {...getStateProps('evaluationCarboneSimplifiee')}
        label="Évaluation Carbone Simplifiée"
        nativeInputProps={getFieldProps('evaluationCarboneSimplifiee')}
      />
      <Input
        {...getStateProps('noteTotale')}
        label="Note"
        nativeInputProps={getFieldProps('noteTotale')}
      />
      <RadioButtons
        {...getStateProps('doitRegenererAttestation')}
        state={validationErrors['doitRegenererAttestation'] ? 'error' : 'default'}
        legend={'Attestation de désignation'}
        disabled={!estNotifiée}
        options={[
          {
            label: "Je souhaite régénérer l'attestation",
            nativeInputProps: {
              name: 'doitRegenererAttestation',
              value: 'true',
              required: true,
            },
          },
          {
            label: "Je ne souhaite pas régénérer l'attestation",
            nativeInputProps: {
              name: 'doitRegenererAttestation',
              value: 'false',
              required: true,
            },
          },
        ]}
      />
    </Form>
  );
};
