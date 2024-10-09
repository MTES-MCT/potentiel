'use client';

import React from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { z } from 'zod';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';
import { makeAutoFormField } from '@/components/atoms/form/AutoFormField';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { candidatureSchema } from '../importer/candidature.schema';

import {
  corrigerCandidatureAction,
  CorrigerCandidatureFormEntries,
} from './corrigerCandidature.action';

export type CorrigerCandidatureFormProps = {
  candidature: CorrigerCandidatureFormEntries;
};

export const CorrigerCandidatureForm: React.FC<CorrigerCandidatureFormProps> = ({
  candidature,
}) => {
  const [validationErrors, setValidationErrors] = React.useState<
    ValidationErrors<keyof CorrigerCandidatureFormEntries>
  >({});

  const AutoFormField = makeAutoFormField(candidatureSchema, candidature, validationErrors);
  const getStateProps = (field: keyof z.infer<typeof candidatureSchema>) => ({
    state: validationErrors[field] ? ('error' as const) : ('default' as const),
    stateRelatedMessage: validationErrors[field],
  });
  const getInputProps = (field: keyof z.infer<typeof candidatureSchema>) => ({
    name: encodeURIComponent(field),
    value: candidature[field] !== undefined ? String(candidature[field]) : undefined,
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
      successMessage={'candidat corrigé'}
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
      <AutoFormField name="statut" />
      <AutoFormField name="noteTotale" />
      <AutoFormField name="nomProjet" />
      <AutoFormField name="nomCandidat" />
      <AutoFormField name="emailContact" />
      <AutoFormField name="nomReprésentantLégal" />
      <AutoFormField name="actionnariat" />
      <AutoFormField name="sociétéMère" />
      <AutoFormField name="typeGarantiesFinancières" />
      <AutoFormField name="dateÉchéanceGf" value={candidature.dateÉchéanceGf?.toISOString()} />
      <AutoFormField name="historiqueAbandon" />
      <AutoFormField name="adresse1" />
      <AutoFormField name="adresse2" />
      <AutoFormField name="codePostal" />
      <AutoFormField name="commune" />
      <AutoFormField name="technologie" />
      <AutoFormField name="puissanceProductionAnnuelle" />
      <AutoFormField name="prixRéference" />
      <AutoFormField name="motifÉlimination" />
      <Checkbox
        {...getStateProps('puissanceÀLaPointe')}
        options={[
          {
            label: 'Engagement de fourniture de puissance à la pointe',
            nativeInputProps: {
              ...getInputProps('puissanceÀLaPointe'),
              defaultValue: candidature.puissanceÀLaPointe ? 'true' : 'false',
            },
          },
        ]}
      />
      <AutoFormField name="evaluationCarboneSimplifiée" />
    </Form>
  );
};
