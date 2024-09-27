'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';

import { transmettreAttestationConformitéAction } from './transmettre/transmettreAttestationConformité.action';
import { modifierAttestationConformitéAction } from './modifier/modifierAttestationConformité.action';

type Action =
  | typeof transmettreAttestationConformitéAction
  | typeof modifierAttestationConformitéAction;

export type AttestationConformitéFormProps = {
  identifiantProjet: string;
  action: Action;
  submitButtonLabel: string;
  donnéesActuelles?: {
    attestation: string;
    preuveTransmissionAuCocontractant: string;
    dateTransmissionAuCocontractant: Iso8601DateTime;
  };
  demanderMainlevée: { visible: boolean; canBeDone: boolean };
};

export const AttestationConformitéForm: FC<AttestationConformitéFormProps> = ({
  identifiantProjet,
  action,
  submitButtonLabel,
  donnéesActuelles,
  demanderMainlevée,
}) => {
  const [validationErrors, setValidationErrors] = useState<Array<string>>([]);

  return (
    <Form
      method="POST"
      encType="multipart/form-data"
      action={action}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour sur le projet
          </Button>
          <SubmitButton>{submitButtonLabel}</SubmitButton>
        </>
      }
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <div className="flex flex-col gap-6">
        <UploadDocument
          name="attestation"
          required
          documentKey={donnéesActuelles?.attestation}
          label="Attestation de conformité"
          state={validationErrors.includes('attestation') ? 'error' : 'default'}
        />

        <UploadDocument
          name="preuveTransmissionAuCocontractant"
          required
          documentKey={donnéesActuelles?.attestation}
          label="Preuve de transmission au co-contractant"
          stateRelatedMessage="Il peut s'agir d'une copie de l'email que vous lui avez envoyé, ou de la copie du courrier si envoyé par voie postale."
          state={
            validationErrors.includes('preuveTransmissionAuCocontractant') ? 'error' : 'default'
          }
        />

        <InputDate
          label="Date de transmission au co-contractant"
          nativeInputProps={{
            type: 'date',
            name: 'dateTransmissionAuCocontractant',
            max: now(),
            required: true,
            'aria-required': true,
            defaultValue: donnéesActuelles?.dateTransmissionAuCocontractant,
          }}
          state={validationErrors.includes('dateTransmissionAuCocontractant') ? 'error' : 'default'}
          stateRelatedMessage="Date de transmission au co-contractant obligatoire"
        />

        {demanderMainlevée.visible && (
          <>
            <Checkbox
              id="demanderMainlevee"
              state={validationErrors.includes('demanderMainlevee') ? 'error' : 'default'}
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
            {!demanderMainlevée.canBeDone && (
              <Alert
                severity="warning"
                small
                description={
                  <p className="p-3">
                    Vous ne pouvez pas faire une demande de mainlevée automatique de vos garanties
                    financières depuis cette page de transmission de l'attestation de conformité en
                    l'absence de votre attestation de constitution des garanties financières sur
                    Potentiel que vous pouvez transmettre depuis{' '}
                    <Link
                      href={Routes.GarantiesFinancières.détail(identifiantProjet)}
                      className="font-semibold"
                    >
                      la page des garanties financières du projet
                    </Link>
                    .
                  </p>
                }
              />
            )}
          </>
        )}
      </div>
    </Form>
  );
};
