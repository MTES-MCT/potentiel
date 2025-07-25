'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../../TypeGarantiesFinancièresSelect';
import {
  enregistrerGarantiesFinancièresAction,
  EnregistrerGarantiesFinancièresFormKeys,
} from '../../(actuelles)/actuelles:enregistrer/enregistrerGarantiesFinancières.action';
import {
  modifierDépôtGarantiesFinancièresAction,
  ModifierDépôtGarantiesFinancièresFormKeys,
} from '../depot:modifier/modifierDépôtGarantiesFinancières.action';

import {
  soumettreDépôtGarantiesFinancièresAction,
  SoumettreDépôtGarantiesFinancièresFormKeys,
} from './soumettreDépôtGarantiesFinancières.action';

type Action =
  | typeof soumettreDépôtGarantiesFinancièresAction
  | typeof modifierDépôtGarantiesFinancièresAction
  | typeof enregistrerGarantiesFinancièresAction;

export type SoumettreDépôtGarantiesFinancièresFormProps = {
  identifiantProjet: string;
  action: Action;
  submitButtonLabel: string;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
  defaultValues?: {
    typeGarantiesFinancières?: TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel'];
    dateÉchéance?: Iso8601DateTime;
    dateConstitution?: Iso8601DateTime;
    attestation?: string;
  };
};

export const SoumettreDépôtGarantiesFinancièresForm: FC<
  SoumettreDépôtGarantiesFinancièresFormProps
> = ({
  identifiantProjet,
  action,
  submitButtonLabel,
  typesGarantiesFinancières,
  defaultValues,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<
      | ModifierDépôtGarantiesFinancièresFormKeys
      | SoumettreDépôtGarantiesFinancièresFormKeys
      | EnregistrerGarantiesFinancièresFormKeys
    >
  >({});

  return (
    <Form
      action={action}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.GarantiesFinancières.détail(identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au détail des garanties financières
          </Button>
          <SubmitButton>{submitButtonLabel}</SubmitButton>
        </>
      }
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <TypeGarantiesFinancièresSelect
        id="type"
        name="type"
        typesGarantiesFinancières={typesGarantiesFinancières}
        dateÉchéanceActuelle={defaultValues?.dateÉchéance}
        typeGarantiesFinancièresActuel={defaultValues?.typeGarantiesFinancières}
        validationErrors={validationErrors}
      />

      <InputDate
        label="Date de constitution"
        name="dateConstitution"
        max={now()}
        defaultValue={defaultValues?.dateConstitution}
        required
        state={validationErrors['dateConstitution'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateConstitution']}
      />

      <UploadNewOrModifyExistingDocument
        label="Attestation de constitution"
        name="attestation"
        required
        formats={['pdf']}
        state={validationErrors['attestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['attestation']}
        documentKeys={defaultValues?.attestation ? [defaultValues.attestation] : undefined}
      />
    </Form>
  );
};
