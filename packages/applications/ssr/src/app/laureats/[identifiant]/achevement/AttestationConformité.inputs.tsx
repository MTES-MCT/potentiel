'use client';

import type { FC } from 'react';

import { DateTime } from '@potentiel-domain/common';
import type { DocumentProjet } from '@potentiel-domain/projet';
import { now } from '@potentiel-libraries/iso8601-datetime';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { InputDate } from '@/components/atoms/form/InputDate';
import type { ValidationErrors } from '@/utils/formAction';

export type AttestationConformitéFormInputProps = {
  attestationConformité?: DocumentProjet.RawType;
  optionnel?: true;
  validationErrors: ValidationErrors<'attestation'>;
};

export const AttestationConformitéFormInput: FC<AttestationConformitéFormInputProps> = ({
  attestationConformité,
  optionnel,
  validationErrors,
}) => (
  <UploadNewOrModifyExistingDocument
    name="attestation"
    multiple
    required={!optionnel}
    documentKeys={attestationConformité ? [attestationConformité] : undefined}
    label={`Attestation de conformité${optionnel ? ' (optionnel)' : ''}`}
    hintText="Joindre l'attestation de conformité en un seul fichier"
    state={validationErrors['attestation'] ? 'error' : 'default'}
    stateRelatedMessage={validationErrors['attestation']}
    formats={['pdf']}
  />
);

export type RapportAssociéFormInputProps = {
  rapportAssocié?: DocumentProjet.RawType;
  optionnel?: true;
  validationErrors: ValidationErrors<'rapportAssocie'>;
};

export const RapportAssociéFormInput: FC<RapportAssociéFormInputProps> = ({
  rapportAssocié,
  optionnel,
  validationErrors,
}) => (
  <UploadNewOrModifyExistingDocument
    name="rapportAssocie"
    multiple
    required={!optionnel}
    documentKeys={rapportAssocié ? [rapportAssocié] : undefined}
    label={`Rapport associé${optionnel ? ' (optionnel)' : ''}`}
    hintText="Joindre le rapport associé en un seul fichier"
    state={validationErrors['rapportAssocie'] ? 'error' : 'default'}
    stateRelatedMessage={validationErrors['rapportAssocie']}
    formats={['pdf']}
  />
);

export type PreuveTransmissionAuCocontractantFormInputProps = {
  preuveTransmissionAuCocontractant?: DocumentProjet.RawType;
  optionnel?: true;
  validationErrors: ValidationErrors<'preuveTransmissionAuCocontractant'>;
};

export const PreuveTransmissionAuCocontractantFormInput: FC<
  PreuveTransmissionAuCocontractantFormInputProps
> = ({ preuveTransmissionAuCocontractant, optionnel, validationErrors }) => (
  <UploadNewOrModifyExistingDocument
    name="preuveTransmissionAuCocontractant"
    required={!optionnel}
    formats={['pdf']}
    documentKeys={
      preuveTransmissionAuCocontractant ? [preuveTransmissionAuCocontractant] : undefined
    }
    label={`Preuve de transmission au Cocontractant${optionnel ? ' (optionnel)' : ''}`}
    hintText="Il peut s'agir d'une copie de l'email que vous lui avez envoyé, ou de la copie du courrier si envoyé par voie postale."
    state={validationErrors['preuveTransmissionAuCocontractant'] ? 'error' : 'default'}
    stateRelatedMessage={validationErrors['preuveTransmissionAuCocontractant']}
  />
);

export type DateAchèvementFormProps = {
  lauréatNotifiéLe: DateTime.RawType;
  dateTransmissionAuCocontractant?: DateTime.RawType;
  validationErrors: ValidationErrors<'dateTransmissionAuCocontractant'>;
};

export const DateAchèvementForm = ({
  lauréatNotifiéLe,
  dateTransmissionAuCocontractant,
  validationErrors,
}: DateAchèvementFormProps) => {
  return (
    <InputDate
      label="Date de transmission au Cocontractant"
      name="dateTransmissionAuCocontractant"
      max={now()}
      min={DateTime.convertirEnValueType(lauréatNotifiéLe).ajouterNombreDeJours(1).formatter()}
      required
      defaultValue={dateTransmissionAuCocontractant}
      state={validationErrors['dateTransmissionAuCocontractant'] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors['dateTransmissionAuCocontractant']}
      small
    />
  );
};
