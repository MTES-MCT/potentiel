import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { formatDateForInput } from '@/utils/formatDateForInput';
import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

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
    typeGarantiesFinancièresActuel?: TypeGarantiesFinancièresSelectProps['typeGarantiesFinancièresActuel'];
    dateÉchéanceActuelle?: string;
    dateConstitutionActuelle?: string;
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
        dateÉchéanceActuelle={defaultValues?.dateÉchéanceActuelle}
        typeGarantiesFinancièresActuel={defaultValues?.typeGarantiesFinancièresActuel}
        validationErrors={validationErrors}
      />

      <Input
        label="Date de constitution"
        nativeInputProps={{
          type: 'date',
          name: 'dateConstitution',
          max: formatDateForInput(new Date().toISOString()),
          defaultValue: defaultValues?.dateConstitutionActuelle,
          required: true,
          'aria-required': true,
        }}
        state={validationErrors.includes('dateConstitution') ? 'error' : 'default'}
        stateRelatedMessage="Date de constitution des garanties financières obligatoire"
      />

      <Upload
        label="Attestation de constitution"
        hint="Format accepté : pdf"
        nativeInputProps={{
          name: 'attestation',
          required: true,
          'aria-required': true,
          accept: '.pdf',
        }}
        state={validationErrors.includes('attestation') ? 'error' : 'default'}
        stateRelatedMessage="Attestation de consitution des garantières financières obligatoire"
      />

      <div className="flex flex-col md:flex-row gap-4 mt-5">
        <Button
          priority="secondary"
          linkProps={{
            href: Routes.Projet.details(identifiantProjet),
          }}
          iconId="fr-icon-arrow-left-line"
        >
          Retour au détail du projet
        </Button>
        <SubmitButton>{submitButtonLabel}</SubmitButton>
      </div>
    </Form>
  );
};
