'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { AlerteChangementÉvaluationCarbone } from '../AlerteChangementÉvaluationCarbone';

import { FournisseursField } from './FournisseursField';
import {
  enregistrerChangementFournisseurAction,
  EnregistrerChangementFournisseurFormKeys,
} from './enregistrerChangementFournisseur.action';

export type EnregistrerChangementFournisseurFormProps =
  PlainType<Lauréat.Fournisseur.ConsulterFournisseurReadModel>;

export const EnregistrerChangementFournisseurForm: FC<
  EnregistrerChangementFournisseurFormProps
> = ({
  identifiantProjet,
  évaluationCarboneSimplifiée: évaluationCarboneSimplifiéeActuelle,
  évaluationCarboneSimplifiéeInitiale,
  fournisseurs,
  technologie,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerChangementFournisseurFormKeys>
  >({});

  const [évaluationCarboneSimplifiée, setÉvaluationCarboneSimplifiée] = useState(
    évaluationCarboneSimplifiéeActuelle,
  );

  return (
    <Form
      action={enregistrerChangementFournisseurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour à la page projet
          </Button>
          <SubmitButton>Confirmer le changement</SubmitButton>
        </>
      }
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />
      <input name="technologie" type="hidden" value={technologie} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Input
            state={validationErrors['evaluationCarboneSimplifiee'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['evaluationCarboneSimplifiee']}
            label="Évaluation carbone simplifiée"
            hintText="kg eq CO2/kWc"
            className="md:max-w-64"
            classes={{
              nativeInputOrTextArea: 'invalid:text-theme-error',
            }}
            nativeInputProps={{
              name: 'evaluationCarboneSimplifiee',
              value: évaluationCarboneSimplifiée,
              type: 'number',
              inputMode: 'decimal',
              step: 0.01,
              required: true,
              min: 0,
              'aria-required': true,
              onChange: (e) => setÉvaluationCarboneSimplifiée(Number(e.target.value)),
            }}
          />
        </div>

        <AlerteChangementÉvaluationCarbone
          nouvelleÉvaluationCarbone={évaluationCarboneSimplifiée}
          évaluationCarboneInitiale={évaluationCarboneSimplifiéeInitiale}
          technologie={technologie}
        />

        <FournisseursField
          fournisseurs={fournisseurs}
          technologie={technologie}
          validationErrors={validationErrors}
          resetValidationErrors={() => setValidationErrors({})}
        />

        <Input
          textArea
          label="Raison"
          id="raison"
          className="md:max-w-96"
          hintText="Veuillez détailler les raisons ayant conduit au changement de fournisseurs."
          nativeTextAreaProps={{
            name: 'raison',
            required: true,
            'aria-required': true,
          }}
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
        />
        <UploadNewOrModifyExistingDocument
          label={'Pièce(s) justificative(s)'}
          name="piecesJustificatives"
          required
          multiple
          formats={['pdf']}
          state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['piecesJustificatives']}
        />
      </div>
    </Form>
  );
};
