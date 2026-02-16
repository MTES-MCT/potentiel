'use client';

import { FC, useState } from 'react';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { ValidationErrors, formAction } from '@/utils/formAction';

import { TransmettreDateMiseEnServiceStateFormKeys } from './transmettre/transmettreDateMiseEnService.action';

export type DateMiseEnServiceFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDésignation: DateTime.RawType;
  dossierRaccordement: {
    référence: Lauréat.Raccordement.RéférenceDossierRaccordement.RawType;
    dateMiseEnService?: DateTime.RawType;
  };
  action: ReturnType<typeof formAction>;
  submitLabel: string;
};

export const DateMiseEnServiceForm: FC<DateMiseEnServiceFormProps> = ({
  identifiantProjet,
  dateDésignation,
  dossierRaccordement: { référence, dateMiseEnService },
  action,
  submitLabel,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDateMiseEnServiceStateFormKeys>
  >({});

  return (
    <Form
      action={action}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel,
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={référence} />

      <InputDate
        label="Date de mise en service"
        name="dateMiseEnService"
        defaultValue={dateMiseEnService}
        min={dateDésignation}
        max={DateTime.now().formatter()}
        required
        state={validationErrors['dateMiseEnService'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateMiseEnService']}
      />
    </Form>
  );
};
