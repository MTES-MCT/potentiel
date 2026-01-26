'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';
import { DateTime } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/projet';

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
  lauréatNotifiéLe: DateTime.RawType;
  action: Action;
  submitLabel: string;

  dateTransmissionAuCocontractant?: DateTime.RawType;
  attestationConformité?: DocumentProjet.RawType;
  preuveTransmissionAuCocontractant?: DocumentProjet.RawType;

  estUneModification?: true;

  demanderMainlevée: { visible: boolean; canBeDone: boolean };
};

export const AttestationConformitéForm: FC<AttestationConformitéFormProps> = ({
  identifiantProjet,
  action,
  submitLabel,
  dateTransmissionAuCocontractant,
  attestationConformité,
  preuveTransmissionAuCocontractant,
  demanderMainlevée,
  lauréatNotifiéLe,
  estUneModification,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<
      ModifierAttestationConformitéFormKeys | TransmettreAttestationConformitéFormKeys
    >
  >({});
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  return (
    <Form
      action={action}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel,
        submitDisabled: !hasChanged,
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

      <div className="flex flex-col gap-6">
        <UploadNewOrModifyExistingDocument
          name="attestation"
          multiple
          required
          documentKeys={attestationConformité ? [attestationConformité] : undefined}
          label="Attestation de conformité et rapport associé"
          hintText="Joindre l'attestation de conformité et le rapport associé, en un ou plusieurs fichier(s)"
          state={validationErrors['attestation'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['attestation']}
          formats={['pdf']}
          onChange={() => setHasChanged(true)}
        />

        <UploadNewOrModifyExistingDocument
          name="preuveTransmissionAuCocontractant"
          required={!estUneModification}
          formats={['pdf']}
          documentKeys={
            preuveTransmissionAuCocontractant ? [preuveTransmissionAuCocontractant] : undefined
          }
          label={`Preuve de transmission au co-contractant${estUneModification ? ' (optionnel)' : ''}`}
          hintText="Il peut s'agir d'une copie de l'email que vous lui avez envoyé, ou de la copie du courrier si envoyé par voie postale."
          state={validationErrors['preuveTransmissionAuCocontractant'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['preuveTransmissionAuCocontractant']}
          onChange={() => setHasChanged(true)}
        />

        <div className="w-fit">
          <InputDate
            label="Date de transmission au co-contractant"
            name="dateTransmissionAuCocontractant"
            max={now()}
            min={DateTime.convertirEnValueType(lauréatNotifiéLe)
              .ajouterNombreDeJours(1)
              .formatter()}
            required
            defaultValue={dateTransmissionAuCocontractant}
            state={validationErrors['dateTransmissionAuCocontractant'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['dateTransmissionAuCocontractant']}
            onChange={() => setHasChanged(true)}
          />
        </div>

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
                    onChange: () => setHasChanged(true),
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
