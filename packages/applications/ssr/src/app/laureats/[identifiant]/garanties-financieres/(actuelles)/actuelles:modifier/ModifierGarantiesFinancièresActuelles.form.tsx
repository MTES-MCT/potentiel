'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { InputDate } from '@/components/atoms/form/InputDate';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import { GarantiesFinancièresActuelles } from '../garantiesFinancièresActuelles.type';
import {
  TypeGarantiesFinancièresSelect,
  TypeGarantiesFinancièresSelectProps,
} from '../../TypeGarantiesFinancièresSelect';

import {
  modifierGarantiesFinancièresActuellesAction,
  ModifierGarantiesFinancièresFormKeys,
} from './modifierGarantiesFinancièresActuelles.action';

export type ModifierGarantiesFinancièresActuellesFormProps = {
  identifiantProjet: string;
  typesGarantiesFinancières: TypeGarantiesFinancièresSelectProps['typesGarantiesFinancières'];
  actuelles: Omit<GarantiesFinancièresActuelles, 'actions' | 'isActuelle'>;
};

export const ModifierGarantiesFinancièresActuellesForm: FC<
  ModifierGarantiesFinancièresActuellesFormProps
> = ({ typesGarantiesFinancières, actuelles, identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierGarantiesFinancièresFormKeys>
  >({});

  return (
    <Form
      action={modifierGarantiesFinancièresActuellesAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
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
        </>
      }
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
        name="dateConstitution"
        max={now()}
        defaultValue={actuelles.dateConstitution}
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
        documentKeys={actuelles.attestation ? [actuelles.attestation] : []}
      />
    </Form>
  );
};
