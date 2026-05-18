'use client';

import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import { useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  AttestationConformitéFormInput,
  DateAchèvementForm,
  DateAchèvementFormProps,
  PreuveTransmissionAuCocontractantFormInput,
} from '../../AttestationConformité.inputs';
import {
  TransmettreAttestationConformitéFormKeys,
  transmettreAttestationConformitéAction,
} from './transmettreAttestationConformité.action';

export type TransmettreAttestationConformitéFormProps = {
  identifiantProjet: string;
  demanderMainlevée: { visible: boolean; canBeDone: boolean };
} & Pick<DateAchèvementFormProps, 'lauréatNotifiéLe'>;

export const TransmettreAttestationConformitéForm = ({
  identifiantProjet,
  demanderMainlevée,
  lauréatNotifiéLe,
}: TransmettreAttestationConformitéFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreAttestationConformitéFormKeys>
  >({});

  return (
    <Form
      action={transmettreAttestationConformitéAction}
      onValidationError={setValidationErrors}
      actionButtons={{
        submitLabel: 'Transmettre',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />
      <AttestationConformitéFormInput validationErrors={validationErrors} />
      <PreuveTransmissionAuCocontractantFormInput validationErrors={validationErrors} />

      <DateAchèvementForm validationErrors={validationErrors} lauréatNotifiéLe={lauréatNotifiéLe} />

      {demanderMainlevée.visible && (
        <Checkbox
          id="demanderMainlevee"
          state={validationErrors['demanderMainlevee'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['demanderMainlevee']}
          options={[
            {
              label: `Je souhaite demander une mainlevée de mes garanties financières`,
              nativeInputProps: {
                disabled: !demanderMainlevée.canBeDone,
                'aria-disabled': !demanderMainlevée.canBeDone,
                name: 'demanderMainlevee',
                value: 'true',
              },
            },
          ]}
        />
      )}
    </Form>
  );
};
