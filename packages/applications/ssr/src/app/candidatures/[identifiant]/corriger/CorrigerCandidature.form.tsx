'use client';

import React, { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import RadioButtons from '@codegouvfr/react-dsfr/RadioButtons';

import { DateTime } from '@potentiel-domain/common';
import { Routes } from '@potentiel-applications/routes';
import { Candidature } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';
import { InputDate } from '@/components/atoms/form/InputDate';
import { CommunePicker } from '@/components/molecules/CommunePicker';
import {
  getActionnariatTypeLabel,
  getGarantiesFinancièresTypeLabel,
  getTechnologieTypeLabel,
} from '@/app/_helpers';

import {
  corrigerCandidatureAction,
  CorrigerCandidatureFormEntries,
} from './corrigerCandidature.action';

export type CorrigerCandidatureFormProps = {
  candidature: CorrigerCandidatureFormEntries;
  estNotifiée: boolean;
  aUneAttestation: boolean;
  unitéPuissance: string;
  champsSupplémentaires: AppelOffre.ChampsSupplémentairesCandidature;
  typesGarantiesFinancièresDisponibles: Candidature.TypeGarantiesFinancières.RawType[];
  typesActionnariatDisponibles: Candidature.TypeActionnariat.RawType[];
};

export const CorrigerCandidatureForm: React.FC<CorrigerCandidatureFormProps> = ({
  candidature,
  typesGarantiesFinancièresDisponibles,
  typesActionnariatDisponibles,
  estNotifiée,
  aUneAttestation,
  unitéPuissance,
  champsSupplémentaires,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<keyof CorrigerCandidatureFormEntries>
  >({});

  const [estÉliminé, setEstÉliminé] = useState(candidature.statut === 'éliminé');
  const [typeGf, setTypeGf] = useState(candidature.typeGarantiesFinancieres);

  const [commune, setCommune] = useState({
    commune: candidature.commune,
    codePostal: candidature.codePostal,
    departement: candidature.departement,
    region: candidature.region,
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
          {
            label: 'Classé',
            value: Candidature.StatutCandidature.classé.statut,
          },
          {
            label: 'Éliminé',
            value: Candidature.StatutCandidature.éliminé.statut,
          },
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
        label="Nom du producteur"
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
          ...typesActionnariatDisponibles.map((type) => ({
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
        label="Société mère (optionnel)"
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
      <div className="flex flex-row gap-2 justify-between">
        <CommunePicker
          defaultValue={commune}
          label="Commune"
          nativeInputProps={{
            required: true,
            'aria-required': true,
          }}
          onSelected={(commune) => commune && setCommune(commune)}
          className="mb-6 flex-1"
        />
        <input type="hidden" value={commune.commune} name="commune" />
        {validationErrors['commune']}
        <input type="hidden" value={commune.departement} name="departement" />
        {validationErrors['departement']}
        <input type="hidden" value={commune.region} name="region" />
        {validationErrors['region']}
        <Input
          state={validationErrors['codePostal'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['codePostal']}
          label="Code Postal"
          nativeInputProps={{
            name: 'codePostal',
            value: commune.codePostal,
            onChange: (e) => setCommune((c) => ({ ...c, codePostal: e.target.value })),
            required: true,
            'aria-required': true,
            minLength: 5,
            maxLength: 5,
          }}
        />
      </div>
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
          type: 'number',
          inputMode: 'decimal',
          pattern: '[0-9]+([.][0-9]+)?',
          step: 'any',
        }}
      />
      <Input
        state={validationErrors['puissanceProductionAnnuelle'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['puissanceProductionAnnuelle']}
        label={`Puissance (en ${unitéPuissance})`}
        nativeInputProps={{
          name: 'puissanceProductionAnnuelle',
          defaultValue: candidature.puissanceProductionAnnuelle,
          required: true,
          'aria-required': true,
          type: 'number',
          inputMode: 'decimal',
          pattern: '[0-9]+([.][0-9]+)?',
          step: 0.1,
        }}
      />
      {champsSupplémentaires.puissanceALaPointe && (
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
      )}
      {champsSupplémentaires.puissanceDeSite && (
        <Input
          state={validationErrors['puissanceDeSite'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['puissanceDeSite']}
          id="puissanceDeSite"
          label={'Puissance de site'}
          nativeInputProps={{
            name: 'puissanceDeSite',
            defaultValue: candidature.puissanceDeSite,
            required: champsSupplémentaires.puissanceDeSite === 'requis',
            'aria-required': champsSupplémentaires.puissanceDeSite === 'requis',
            type: 'number',
            inputMode: 'decimal',
            pattern: '[0-9]+([.][0-9]+)?',
            step: 0.1,
          }}
        />
      )}
      <Input
        state={validationErrors['evaluationCarboneSimplifiee'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['evaluationCarboneSimplifiee']}
        label="Évaluation carbone simplifiée"
        hintText="kg eq CO2/kWc"
        nativeInputProps={{
          name: 'evaluationCarboneSimplifiee',
          defaultValue: candidature.evaluationCarboneSimplifiee,
          required: true,
          'aria-required': true,
          type: 'number',
          inputMode: 'decimal',
          pattern: '[0-9]+([.][0-9]+)?',
          step: 'any',
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
          type: 'number',
          inputMode: 'decimal',
          pattern: '[0-9]+([.][0-9]+)?',
          step: 'any',
        }}
      />
      {!estNotifiée && !estÉliminé ? (
        <>
          <Select
            state={validationErrors['typeGarantiesFinancieres'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['typeGarantiesFinancieres']}
            label="Type de Garanties Financières"
            options={typesGarantiesFinancièresDisponibles.map((type) => ({
              value: type,
              label: getGarantiesFinancièresTypeLabel(type),
            }))}
            nativeSelectProps={{
              name: 'typeGarantiesFinancieres',
              defaultValue: candidature.typeGarantiesFinancieres,
              required: true,
              'aria-required': true,
              onChange: (e) => setTypeGf(e.target.value),
            }}
          />
          {typeGf === 'avec-date-échéance' && (
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
          {typeGf === 'exemption' && (
            <InputDate
              name="dateDeliberationGf"
              label="Date de délibération de l'exemption de Garanties Financières"
              required
              defaultValue={
                candidature.dateDeliberationGf &&
                DateTime.convertirEnValueType(candidature.dateDeliberationGf).formatter()
              }
              state={validationErrors['dateDeliberationGf'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['dateDeliberationGf']}
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
          <input type="hidden" name="dateEcheanceGf" value={candidature.dateEcheanceGf} />
        </>
      )}
      {champsSupplémentaires.coefficientKChoisi && (
        <Select
          state={validationErrors['coefficientKChoisi'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['coefficientKChoisi']}
          id="coefficientKChoisi"
          label={'Choix du coefficient K'}
          nativeSelectProps={{
            name: 'coefficientKChoisi',
            defaultValue: candidature.coefficientKChoisi ? 'true' : 'false',
            required: true,
            'aria-required': true,
          }}
          options={[
            { label: 'Oui', value: 'true' },
            { label: 'Non', value: 'false' },
          ]}
        />
      )}
      {champsSupplémentaires.autorisationDUrbanisme && (
        <>
          <Input
            state={validationErrors['numeroDAutorisationDUrbanisme'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['numeroDAutorisationDUrbanisme']}
            label="Numéro d'autorisation d'urbanisme"
            nativeInputProps={{
              name: 'numeroDAutorisationDUrbanisme',
              defaultValue: candidature.numeroDAutorisationDUrbanisme,
              required: true,
              'aria-required': true,
            }}
          />
          <InputDate
            name="dateDAutorisationDUrbanisme"
            label="Date d'obtention de l'autorisation d'urbanisme"
            required
            defaultValue={
              candidature.dateDAutorisationDUrbanisme &&
              DateTime.convertirEnValueType(candidature.dateDAutorisationDUrbanisme).formatter()
            }
            state={validationErrors['dateDAutorisationDUrbanisme'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['dateDAutorisationDUrbanisme']}
          />
        </>
      )}
      {champsSupplémentaires.installateur && (
        <Input
          state={validationErrors['installateur'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['installateur']}
          label="Installateur (optionnel)"
          nativeInputProps={{
            name: 'installateur',
            defaultValue: candidature.installateur,
          }}
        />
      )}
      {champsSupplémentaires.installationAvecDispositifDeStockage && (
        <Select
          state={validationErrors['installationAvecDispositifDeStockage'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['installationAvecDispositifDeStockage']}
          id="installationAvecDispositifDeStockage"
          label={'Dispositif de stockage'}
          nativeSelectProps={{
            name: 'installationAvecDispositifDeStockage',
            value: candidature.installationAvecDispositifDeStockage ? 'true' : 'false',
            required: true,
            'aria-required': true,
          }}
          options={[
            { label: 'avec', value: 'true' },
            { label: 'sans', value: 'false' },
          ]}
        />
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
