'use client';

import React, { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { z } from 'zod';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/candidature';
import { Iso8601DateTime } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';
import { InputDate } from '@/components/atoms/form/InputDate';

import { candidatureSchema } from '../importer/candidature.schema';
import { getGarantiesFinancièresTypeLabel } from '../../garanties-financières/getGarantiesFinancièresTypeLabel';
import { getTechnologieTypeLabel } from '../helpers';

import {
  corrigerCandidatureAction,
  CorrigerCandidatureFormEntries,
} from './corrigerCandidature.action';

export type CorrigerCandidatureFormProps = {
  candidature: CorrigerCandidatureFormEntries;
  estNotifiée: boolean;
  aUneAttestation: boolean;
};

export const CorrigerCandidatureForm: React.FC<CorrigerCandidatureFormProps> = ({
  candidature,
  estNotifiée,
  aUneAttestation,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<keyof CorrigerCandidatureFormEntries>
  >({});

  const [estÉliminé, setEstÉliminé] = useState(candidature.statut === 'éliminé');
  const [showDateGf, setShowDateGf] = useState(
    candidature.typeGarantiesFinancieres === 'avec-date-échéance',
  );

  const getFieldProps = (field: keyof z.infer<typeof candidatureSchema>, required = true) => ({
    name: encodeURIComponent(field),
    defaultValue: candidature[field] !== undefined ? String(candidature[field]) : undefined,
    required: required,
    'aria-required': required,
  });

  return (
    <Form
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
        state={validationErrors['statut'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['statut']}
        label="Statut"
        options={[
          { label: 'Classé', value: Candidature.StatutCandidature.classé.statut },
          { label: 'Éliminé', value: Candidature.StatutCandidature.éliminé.statut },
        ]}
        nativeSelectProps={{
          ...getFieldProps('statut'),
          onChange: (e) =>
            setEstÉliminé(e.target.value === Candidature.StatutCandidature.éliminé.statut),
        }}
        disabled={estNotifiée}
      />
      {estÉliminé && (
        <Input
          textArea
          state={validationErrors['motifElimination'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['motifElimination']}
          label="Motif élimination"
          nativeTextAreaProps={getFieldProps('motifElimination')}
        />
      )}
      <Input
        state={validationErrors['nomProjet'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomProjet']}
        label="Nom du projet"
        nativeInputProps={getFieldProps('nomProjet')}
      />
      <Input
        state={validationErrors['nomCandidat'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomCandidat']}
        label="Nom du candidat"
        nativeInputProps={getFieldProps('nomCandidat')}
      />
      <Input
        state={validationErrors['emailContact'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['emailContact']}
        label="Email"
        nativeInputProps={getFieldProps('emailContact')}
      />
      <Input
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
        label="Nom complet du représentant légal"
        nativeInputProps={getFieldProps('nomRepresentantLegal')}
      />
      <Select
        state={validationErrors['actionnariat'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['actionnariat']}
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
        nativeSelectProps={getFieldProps('actionnariat', false)}
      />
      <Input
        state={validationErrors['societeMere'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['societeMere']}
        label="Société Mère (optionnel)"
        nativeInputProps={getFieldProps('societeMere', false)}
      />
      <Input
        state={validationErrors['adresse1'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['adresse1']}
        label="Adresse 1"
        nativeInputProps={getFieldProps('adresse1')}
      />
      <Input
        state={validationErrors['adresse2'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['adresse2']}
        label="Adresse 2 (optionnel)"
        nativeInputProps={getFieldProps('adresse2', false)}
      />
      <Input
        state={validationErrors['codePostal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['codePostal']}
        label="Code Postal"
        nativeInputProps={getFieldProps('codePostal')}
      />
      <Input
        state={validationErrors['commune'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['commune']}
        label="Commune"
        nativeInputProps={getFieldProps('commune')}
      />
      <Select
        state={validationErrors['technologie'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['technologie']}
        label="Technologie"
        nativeSelectProps={getFieldProps('technologie')}
        options={Candidature.TypeTechnologie.types.map((type) => ({
          value: type,
          label: getTechnologieTypeLabel(type),
        }))}
      />
      <Input
        state={validationErrors['prixReference'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['prixReference']}
        label="Prix de référence"
        nativeInputProps={getFieldProps('prixReference')}
      />
      <Input
        state={validationErrors['puissanceProductionAnnuelle'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['puissanceProductionAnnuelle']}
        label="Puissance (en MWc)"
        nativeInputProps={getFieldProps('puissanceProductionAnnuelle')}
      />
      <Checkbox
        state={validationErrors['puissanceALaPointe'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['puissanceALaPointe']}
        id="puissanceALaPointe"
        options={[
          {
            label: 'Engagement de fourniture de puissance à la pointe',
            nativeInputProps: {
              ...getFieldProps('puissanceALaPointe', false),
              value: 'true',
              defaultChecked: candidature.puissanceALaPointe,
            },
          },
        ]}
      />
      <Input
        state={validationErrors['evaluationCarboneSimplifiee'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['evaluationCarboneSimplifiee']}
        label="Évaluation Carbone Simplifiée"
        nativeInputProps={getFieldProps('evaluationCarboneSimplifiee')}
      />
      <Input
        state={validationErrors['noteTotale'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['noteTotale']}
        label="Note"
        nativeInputProps={getFieldProps('noteTotale')}
      />
      {!estNotifiée && !estÉliminé ? (
        <>
          <Select
            state={validationErrors['typeGarantiesFinancieres'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['typeGarantiesFinancieres']}
            label="Type de Garanties Financières"
            options={[
              Candidature.TypeGarantiesFinancières.consignation,
              Candidature.TypeGarantiesFinancières.avecDateÉchéance,
              Candidature.TypeGarantiesFinancières.sixMoisAprèsAchèvement,
            ].map(({ type }) => ({ value: type, label: getGarantiesFinancièresTypeLabel(type) }))}
            nativeSelectProps={{
              ...getFieldProps('typeGarantiesFinancieres'),
              onChange: (e) =>
                setShowDateGf(
                  e.target.value === Candidature.TypeGarantiesFinancières.avecDateÉchéance.type,
                ),
            }}
          />
          {showDateGf && (
            <InputDate
              state={validationErrors['dateEcheanceGf'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['dateEcheanceGf']}
              label="Date d'échéance des Garanties Financières"
              nativeInputProps={{
                ...getFieldProps('dateEcheanceGf'),
                type: 'date',
                defaultValue: candidature.dateEcheanceGf?.toISOString() as Iso8601DateTime,
              }}
            />
          )}
        </>
      ) : (
        <>
          <input
            type="hidden"
            name="typeGarantiesFinancieres"
            value={candidature.typeGarantiesFinancieres}
          />
          <input
            type="hidden"
            name="dateEcheanceGf"
            value={candidature.dateEcheanceGf?.toISOString()}
          />
        </>
      )}

      <RadioButtons
        state={validationErrors['doitRegenererAttestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['doitRegenererAttestation']}
        legend={'Attestation de désignation'}
        disabled={!aUneAttestation}
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
