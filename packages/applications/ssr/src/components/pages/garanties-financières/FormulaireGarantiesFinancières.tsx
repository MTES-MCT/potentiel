import { FC, useState } from 'react';
import { Upload } from '@codegouvfr/react-dsfr/Upload';
import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';

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
      buttons={
        <>
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

      <Upload
        label={
          <>
            Attestation de constitution{' '}
            {defaultValues && defaultValues.attestation && (
              <>
                <br />
                <small>
                  Pour que la modification puisse fonctionner, merci de joindre un nouveau fichier
                  ou{' '}
                  <Link
                    href={Routes.Document.télécharger(defaultValues.attestation)}
                    target="_blank"
                  >
                    celui préalablement transmis
                  </Link>
                </small>
              </>
            )}
          </>
        }
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
    </Form>
  );
};
