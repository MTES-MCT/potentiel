'use client';

import { FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { ValidationErrors } from '@/utils/formAction';

import {
  transmettreDateMiseEnServiceAction,
  TransmettreDateMiseEnServiceStateFormKeys,
} from './transmettreDateMiseEnService.action';

export type TransmettreDateMiseEnServiceFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDésignation: Iso8601DateTime;
  dossierRaccordement: {
    référence: string;
    miseEnService?: Iso8601DateTime;
  };
};

export const TransmettreDateMiseEnServiceForm: FC<TransmettreDateMiseEnServiceFormProps> = ({
  identifiantProjet,
  dateDésignation,
  dossierRaccordement: { référence, miseEnService },
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDateMiseEnServiceStateFormKeys>
  >({});

  return (
    <Form
      action={transmettreDateMiseEnServiceAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitButtonLabel: 'Transmettre',
        backButton: {
          url: Routes.Raccordement.détail(identifiantProjet),
          label: 'Retour aux dossiers de raccordement',
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={référence} />

      <InputDate
        label="Date de mise en service"
        name="dateMiseEnService"
        defaultValue={miseEnService}
        min={dateDésignation}
        max={now()}
        required
        state={validationErrors['dateMiseEnService'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateMiseEnService']}
      />
    </Form>
  );
};
