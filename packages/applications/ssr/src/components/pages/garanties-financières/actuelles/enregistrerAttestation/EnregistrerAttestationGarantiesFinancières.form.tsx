'use client';
import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { enregistrerAttestationGarantiesFinancièresAction } from './enregistrerAttestationGarantiesFinancières.action';

export type EnregistrerAttestationGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const EnregistrerAttestationGarantiesFinancièresForm: FC<
  EnregistrerAttestationGarantiesFinancièresFormProps
> = ({ identifiantProjet }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={enregistrerAttestationGarantiesFinancièresAction}
      onSuccess={() => router.push(Routes.GarantiesFinancières.détail(identifiantProjet))}
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
          <SubmitButton>Enregistrer</SubmitButton>
        </>
      }
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />

      <InputDate
        label="Date de constitution"
        nativeInputProps={{
          type: 'date',
          name: 'dateConstitution',
          max: now(),
          required: true,
          'aria-required': true,
        }}
        state={validationErrors.includes('dateConstitution') ? 'error' : 'default'}
        stateRelatedMessage="Date de constitution des garanties financières obligatoire"
      />

      <UploadDocument
        label="Attestation de constitution"
        name="attestation"
        required
        state={validationErrors.includes('attestation') ? 'error' : 'default'}
      />
    </Form>
  );
};
