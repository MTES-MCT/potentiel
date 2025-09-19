'use client';
import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  enregistrerAttestationGarantiesFinancièresAction,
  EnregistrerAttestationGarantiesFinancièresFormKeys,
} from './enregistrerAttestationGarantiesFinancières.action';

export type EnregistrerAttestationGarantiesFinancièresFormProps = {
  identifiantProjet: string;
  garantiesFinancièresActuelles: PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
};

export const EnregistrerAttestationGarantiesFinancièresForm: FC<
  EnregistrerAttestationGarantiesFinancièresFormProps
> = ({ identifiantProjet, garantiesFinancièresActuelles }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerAttestationGarantiesFinancièresFormKeys>
  >({});

  return (
    <Form
      action={enregistrerAttestationGarantiesFinancièresAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Enregistrer',
        secondaryAction: {
          type: 'back',
          href: Routes.GarantiesFinancières.détail(identifiantProjet),
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />

      <InputDate
        label={
          garantiesFinancièresActuelles.garantiesFinancières.type.type === 'exemption'
            ? 'Date de délibération'
            : 'Date de constitution'
        }
        name="dateConstitution"
        max={now()}
        defaultValue={garantiesFinancièresActuelles.dateConstitution?.date}
        required
        state={validationErrors['dateConstitution'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateConstitution']}
      />

      <UploadNewOrModifyExistingDocument
        label={
          garantiesFinancièresActuelles.garantiesFinancières.type.type === 'exemption'
            ? 'Délibération approuvant le projet objet de l’offre'
            : 'Attestation de constitution'
        }
        name="attestation"
        required
        formats={['pdf']}
        state={validationErrors['attestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['attestation']}
      />
    </Form>
  );
};
