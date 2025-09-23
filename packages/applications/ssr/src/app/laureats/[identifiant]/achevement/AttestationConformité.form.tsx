'use client';
import { FC, useState } from 'react';
import Link from 'next/link';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  transmettreAttestationConformitéAction,
  TransmettreAttestationConformitéFormKeys,
} from './attestation-conformite:transmettre/transmettreAttestationConformité.action';
import {
  modifierAttestationConformitéAction,
  ModifierAttestationConformitéFormKeys,
} from './attestation-conformite:modifier/modifierAttestationConformité.action';

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
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<
      ModifierAttestationConformitéFormKeys | TransmettreAttestationConformitéFormKeys
    >
  >({});

  return (
    <Form
      action={action}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitButtonLabel,
        backButton: {
          url: Routes.Projet.details(identifiantProjet),
          label: 'Retour à la projet',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <div className="flex flex-col gap-6">
        <UploadNewOrModifyExistingDocument
          name="attestation"
          multiple
          required
          documentKeys={donnéesActuelles && [donnéesActuelles.attestation]}
          label="Attestation de conformité et rapport associé"
          hintText="Joindre l'attestation de conformité et le rapport associé, en un ou plusieurs fichier(s)"
          state={validationErrors['attestation'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['attestation']}
          formats={['pdf']}
        />

        <UploadNewOrModifyExistingDocument
          name="preuveTransmissionAuCocontractant"
          required
          formats={['pdf']}
          documentKeys={donnéesActuelles && [donnéesActuelles.preuveTransmissionAuCocontractant]}
          label="Preuve de transmission au co-contractant"
          hintText="Il peut s'agir d'une copie de l'email que vous lui avez envoyé, ou de la copie du courrier si envoyé par voie postale."
          state={validationErrors['preuveTransmissionAuCocontractant'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['preuveTransmissionAuCocontractant']}
        />

        <InputDate
          label="Date de transmission au co-contractant"
          name="dateTransmissionAuCocontractant"
          max={now()}
          required
          defaultValue={donnéesActuelles?.dateTransmissionAuCocontractant}
          state={validationErrors['dateTransmissionAuCocontractant'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['dateTransmissionAuCocontractant']}
        />

        {demanderMainlevée.visible && (
          <>
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
