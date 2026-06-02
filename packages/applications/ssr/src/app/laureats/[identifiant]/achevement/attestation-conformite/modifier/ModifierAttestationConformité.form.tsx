'use client';

import { useState } from 'react';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  AttestationConformitéFormInput,
  type AttestationConformitéFormInputProps,
  RapportAssociéFormInput,
  type RapportAssociéFormInputProps,
} from '../../AttestationConformité.inputs';
import {
  type ModifierAttestationConformitéFormKeys,
  modifierAttestationConformitéAction,
} from './modifierAttestationConformité.action';

export type ModifierAttestationConformitéFormProps = {
  identifiantProjet: string;
  attestationConformité: AttestationConformitéFormInputProps['attestationConformité'];
  rapportAssocié: RapportAssociéFormInputProps['rapportAssocié'];
};

type DocumentModifiéState = {
  attestation: boolean | undefined;
  rapportAssocie: boolean | undefined;
};

export const ModifierAttestationConformitéForm = ({
  identifiantProjet,
  attestationConformité,
  rapportAssocié,
}: ModifierAttestationConformitéFormProps) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierAttestationConformitéFormKeys>
  >({});

  const [documentModifié, setDocumentModifié] = useState<DocumentModifiéState>({
    attestation: undefined,
    rapportAssocie: undefined,
  });

  const shouldDisableButton = () => {
    const aucuneModification =
      documentModifié.attestation === undefined && documentModifié.rapportAssocie === undefined;

    if (aucuneModification) {
      return true;
    }

    const attestationValide =
      documentModifié.attestation === undefined
        ? !!attestationConformité
        : documentModifié.attestation;

    const rapportValide =
      documentModifié.rapportAssocie === undefined
        ? !!rapportAssocié
        : documentModifié.rapportAssocie;

    return !attestationValide || !rapportValide;
  };

  return (
    <Form
      action={modifierAttestationConformitéAction}
      onValidationError={setValidationErrors}
      actionButtons={{
        submitLabel: 'Modifier',
        submitDisabled: shouldDisableButton(),
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input name="identifiantProjet" type="hidden" value={identifiantProjet} />
      <AttestationConformitéFormInput
        validationErrors={validationErrors}
        attestationConformité={attestationConformité}
        onChange={(filenames) =>
          setDocumentModifié((prev) => ({ ...prev, attestation: filenames.length > 0 }))
        }
      />
      <RapportAssociéFormInput
        rapportAssocié={rapportAssocié}
        validationErrors={validationErrors}
        onChange={(filenames) =>
          setDocumentModifié((prev) => ({ ...prev, rapportAssocie: filenames.length > 0 }))
        }
      />
    </Form>
  );
};
