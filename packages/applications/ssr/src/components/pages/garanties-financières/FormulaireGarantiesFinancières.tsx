import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { soumettreGarantiesFinancièresAction } from './dépôt/soumettre/soumettreGarantiesFinancières.action';
import { modifierDépôtEnCoursGarantiesFinancièresAction } from './dépôt/modifier/modifierDépôtEnCoursGarantiesFinancières.action';
import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from './TypeGarantiesFinancièresSelect';
import { enregistrerGarantiesFinancièresAction } from './actuelles/enregistrer/enregistrerGarantiesFinancières.action';

type Action =
  | typeof soumettreGarantiesFinancièresAction
  | typeof modifierDépôtEnCoursGarantiesFinancièresAction
  | typeof enregistrerGarantiesFinancièresAction;

export type FormulaireGarantiesFinancièresProps = {
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

export const FormulaireGarantiesFinancières: FC<FormulaireGarantiesFinancièresProps> = ({
  identifiantProjet,
  action,
  submitButtonLabel,
  typesGarantiesFinancières,
  defaultValues,
}) => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);
  const router = useRouter();
  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={action}
      onSuccess={() => router.push(Routes.GarantiesFinancières.détail(identifiantProjet))}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
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
        nativeInputProps={{
          type: 'date',
          name: 'dateConstitution',
          max: now(),
          defaultValue: defaultValues?.dateConstitution,
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
        stateRelatedMessage="Attestation de consitution des garantières financières obligatoire"
        documentKey={defaultValues?.attestation}
      />

      <div className="flex flex-col md:flex-row gap-4 mt-5">
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.GarantiesFinancières.détail(identifiantProjet),
          }}
          iconId="fr-icon-arrow-left-line"
        >
          Retour au détail des garanties financières
        </Button>
        <SubmitButton>{submitButtonLabel}</SubmitButton>
      </div>
    </Form>
  );
};
