'use client';

import React, { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/candidature';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';
import { InputDate } from '@/components/atoms/form/InputDate';

import { getGarantiesFinancièresTypeLabel } from '../../garanties-financières/getGarantiesFinancièresTypeLabel';
import { getTechnologieTypeLabel } from '../helpers';
import { getActionnariatTypeLabel } from '../helpers/getActionnariatTypeLabel';

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

  const typesActionnariat = IdentifiantProjet.convertirEnValueType(
    candidature.identifiantProjet,
  ).appelOffre.startsWith('PPE2')
    ? Candidature.TypeActionnariat.ppe2Types
    : Candidature.TypeActionnariat.cre4Types;

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
          name: 'statut',
          defaultValue: candidature.statut,
          required: true,
          'aria-required': true,
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
          nativeTextAreaProps={{
            name: 'motifElimination',
            defaultValue: candidature.motifElimination,
            required: true,
            'aria-required': true,
          }}
        />
      )}
      <Input
        state={validationErrors['nomProjet'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomProjet']}
        label="Nom du projet"
        nativeInputProps={{
          name: 'nomProjet',
          defaultValue: candidature.nomProjet,
          required: true,
          'aria-required': true,
        }}
      />
      <Input
        state={validationErrors['nomCandidat'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomCandidat']}
        label="Nom du candidat"
        nativeInputProps={{
          name: 'nomCandidat',
          defaultValue: candidature.nomCandidat,
          required: true,
          'aria-required': true,
        }}
      />
      <Input
        state={validationErrors['emailContact'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['emailContact']}
        label="Email"
        nativeInputProps={{
          name: 'emailContact',
          defaultValue: candidature.emailContact,
          required: true,
          'aria-required': true,
        }}
      />
      <Input
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
        label="Nom complet du représentant légal"
        nativeInputProps={{
          name: 'nomRepresentantLegal',
          defaultValue: candidature.nomRepresentantLegal,
          required: true,
          'aria-required': true,
        }}
      />
      <Select
        state={validationErrors['actionnariat'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['actionnariat']}
        label="Type d'actionnariat (optionnel)"
        options={[
          { label: 'Aucun', value: '' },
          ...typesActionnariat.map((type) => ({
            label: getActionnariatTypeLabel(type),
            value: type,
          })),
        ]}
        nativeSelectProps={{
          name: 'actionnariat',
          defaultValue: candidature.actionnariat,
        }}
      />
      <Input
        state={validationErrors['societeMere'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['societeMere']}
        label="Société Mère (optionnel)"
        nativeInputProps={{
          name: 'societeMere',
          defaultValue: candidature.societeMere,
        }}
      />
      <Input
        state={validationErrors['adresse1'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['adresse1']}
        label="Adresse 1"
        nativeInputProps={{
          name: 'adresse1',
          defaultValue: candidature.adresse1,
          required: true,
          'aria-required': true,
        }}
      />
      <Input
        state={validationErrors['adresse2'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['adresse2']}
        label="Adresse 2 (optionnel)"
        nativeInputProps={{
          name: 'adresse2',
          defaultValue: candidature.adresse2,
        }}
      />
      <Input
        state={validationErrors['codePostal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['codePostal']}
        label="Code Postal"
        nativeInputProps={{
          name: 'codePostal',
          defaultValue: candidature.codePostal,
          required: true,
          'aria-required': true,
        }}
      />
      <Input
        state={validationErrors['commune'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['commune']}
        label="Commune"
        nativeInputProps={{
          name: 'commune',
          defaultValue: candidature.commune,
          required: true,
          'aria-required': true,
        }}
      />
      <Select
        state={validationErrors['technologie'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['technologie']}
        label="Technologie"
        nativeSelectProps={{
          name: 'technologie',
          defaultValue: candidature.technologie,
          required: true,
          'aria-required': true,
        }}
        options={Candidature.TypeTechnologie.types.map((type) => ({
          value: type,
          label: getTechnologieTypeLabel(type),
        }))}
      />
      <Input
        state={validationErrors['prixReference'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['prixReference']}
        label="Prix de référence"
        nativeInputProps={{
          name: 'prixReference',
          defaultValue: candidature.prixReference,
          required: true,
          'aria-required': true,
        }}
      />
      <Input
        state={validationErrors['puissanceProductionAnnuelle'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['puissanceProductionAnnuelle']}
        label="Puissance (en MWc)"
        nativeInputProps={{
          name: 'puissanceProductionAnnuelle',
          defaultValue: candidature.puissanceProductionAnnuelle,
          required: true,
          'aria-required': true,
        }}
      />
      <Checkbox
        state={validationErrors['puissanceALaPointe'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['puissanceALaPointe']}
        id="puissanceALaPointe"
        options={[
          {
            label: 'Engagement de fourniture de puissance à la pointe',
            nativeInputProps: {
              name: 'puissanceALaPointe',
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
        nativeInputProps={{
          name: 'evaluationCarboneSimplifiee',
          defaultValue: candidature.evaluationCarboneSimplifiee,
          required: true,
          'aria-required': true,
        }}
      />
      <Input
        state={validationErrors['noteTotale'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['noteTotale']}
        label="Note"
        nativeInputProps={{
          name: 'noteTotale',
          defaultValue: candidature.noteTotale,
          required: true,
          'aria-required': true,
        }}
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
              name: 'typeGarantiesFinancieres',
              defaultValue: candidature.typeGarantiesFinancieres,
              required: true,
              'aria-required': true,
              onChange: (e) =>
                setShowDateGf(
                  e.target.value === Candidature.TypeGarantiesFinancières.avecDateÉchéance.type,
                ),
            }}
          />
          {showDateGf && (
            <InputDate
              name="dateEcheanceGf"
              label="Date d'échéance des Garanties Financières"
              required
              defaultValue={
                candidature.dateEcheanceGf &&
                DateTime.convertirEnValueType(candidature.dateEcheanceGf).formatter()
              }
              state={validationErrors['dateEcheanceGf'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['dateEcheanceGf']}
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
