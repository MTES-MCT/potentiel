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
import { GarantiesFinancièresActuelles } from '@/components/organisms/garantiesFinancières/types';

import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../../TypeGarantiesFinancièresSelect';

import { modifierGarantiesFinancièresActuellesAction } from './modifierGarantiesFinancièresActuelles.action';

export type ModifierGarantiesFinancièresActuellesFormProps = {
  identifiantProjet: string;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
  actuelles: Omit<GarantiesFinancièresActuelles, 'actions' | 'isActuelle'>;
};

export const ModifierGarantiesFinancièresActuellesForm: FC<
  ModifierGarantiesFinancièresActuellesFormProps
> = ({ typesGarantiesFinancières, actuelles, identifiantProjet }) => {
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={modifierGarantiesFinancièresActuellesAction}
      onSuccess={() => router.push(Routes.GarantiesFinancières.détail(identifiantProjet))}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />

      <TypeGarantiesFinancièresSelect
        id="type"
        name="type"
        validationErrors={validationErrors}
        typesGarantiesFinancières={typesGarantiesFinancières}
        typeGarantiesFinancièresActuel={
          actuelles.type as TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel']
        }
        dateÉchéanceActuelle={actuelles.dateÉchéance}
      />

      <InputDate
        label="Date de constitution"
        nativeInputProps={{
          type: 'date',
          name: 'dateConstitution',
          max: now(),
          defaultValue: actuelles.dateConstitution,
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
        documentKey={actuelles.attestation}
      />

      <div className="flex flex-col md:flex-row gap-4 mt-5">
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
        <SubmitButton>Modifier</SubmitButton>
      </div>
    </Form>
  );
};
