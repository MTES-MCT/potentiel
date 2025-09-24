'use client';

import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';
import { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DocumentProjet } from '@potentiel-domain/document';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../../TypeGarantiesFinancièresSelect';

import {
  modifierGarantiesFinancièresActuellesAction,
  ModifierGarantiesFinancièresFormKeys,
} from './modifierGarantiesFinancièresActuelles.action';

export type ModifierGarantiesFinancièresActuellesFormProps = {
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
  actuelles: PlainType<Lauréat.GarantiesFinancières.ConsulterGarantiesFinancièresReadModel>;
};

export const ModifierGarantiesFinancièresActuellesForm: FC<
  ModifierGarantiesFinancièresActuellesFormProps
> = ({ typesGarantiesFinancières, actuelles }) => {
  const identifiantProjet = IdentifiantProjet.bind(actuelles.identifiantProjet).formatter();
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierGarantiesFinancièresFormKeys>
  >({});

  return (
    <Form
      action={modifierGarantiesFinancièresActuellesAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
          href: Routes.GarantiesFinancières.détail(identifiantProjet),
          label: 'Retour aux détails des garanties financières',
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />

      <TypeGarantiesFinancièresSelect
        id="type"
        name="type"
        validationErrors={validationErrors}
        typesGarantiesFinancières={typesGarantiesFinancières}
        garantiesFinancièresActuelles={actuelles.garantiesFinancières}
      />
      <InputDate
        label="Date de constitution"
        name="dateConstitution"
        max={now()}
        defaultValue={actuelles.dateConstitution?.date}
        required
        state={validationErrors['dateConstitution'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateConstitution']}
      />

      <UploadNewOrModifyExistingDocument
        label="Attestation de constitution"
        name="attestation"
        required
        formats={['pdf']}
        state={validationErrors['attestation'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['attestation']}
        documentKeys={
          actuelles.attestation ? [DocumentProjet.bind(actuelles.attestation).formatter()] : []
        }
      />
    </Form>
  );
};
