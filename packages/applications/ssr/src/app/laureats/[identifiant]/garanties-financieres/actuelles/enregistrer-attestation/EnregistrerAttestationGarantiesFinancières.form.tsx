'use client';
import { type FC, useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';
import type { Lauréat } from '@potentiel-domain/projet';
import { now } from '@potentiel-libraries/iso8601-datetime';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import type { ValidationErrors } from '@/utils/formAction';
import { getGarantiesFinancièresAttestationLabel } from '../../_helpers/getGarantiesFinancièresAttestationLabel';
import { getGarantiesFinancièresDateLabel } from '../../_helpers/getGarantiesFinancièresDateLabel';
import {
  type EnregistrerAttestationGarantiesFinancièresFormKeys,
  enregistrerAttestationGarantiesFinancièresAction,
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
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />

      <InputDate
        label={getGarantiesFinancièresDateLabel(
          garantiesFinancièresActuelles.garantiesFinancières.type.type,
        )}
        name="dateConstitution"
        max={now()}
        defaultValue={garantiesFinancièresActuelles.garantiesFinancières.constitution?.date.date}
        required
        state={validationErrors['dateConstitution'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateConstitution']}
        small
      />

      <UploadNewOrModifyExistingDocument
        label={getGarantiesFinancièresAttestationLabel(
          garantiesFinancièresActuelles.garantiesFinancières.type.type,
        )}
        name="attestation"
        required
        formats={['pdf']}
        state={validationErrors['attestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['attestation']}
      />
    </Form>
  );
};
