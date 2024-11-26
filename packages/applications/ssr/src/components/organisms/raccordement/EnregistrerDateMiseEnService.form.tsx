'use client';

import { FC, useState } from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  enregistrerDateMiseEnServiceAction,
  EnregistrerDateMiseEnServiceStateFormKeys,
} from './enregistrerDateMiseEnService.action';

export type EnregistrerDateMiseEnServiceFormProps = {
  usecase: 'modifier' | 'transmettre';
  projet: {
    identifiantProjet: string;
    dateDésignation: Iso8601DateTime;
  };
  dossierRaccordement: {
    référence: string;
    miseEnService?: Iso8601DateTime;
  };
};

export const EnregistrerDateMiseEnServiceForm: FC<EnregistrerDateMiseEnServiceFormProps> = ({
  usecase,
  projet: { identifiantProjet, dateDésignation },
  dossierRaccordement: { référence, miseEnService },
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<EnregistrerDateMiseEnServiceStateFormKeys>
  >({});

  return (
    <Form
      action={enregistrerDateMiseEnServiceAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Raccordement.détail(identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour aux dossiers de raccordement
          </Button>
          <SubmitButton classname="capitalize">{usecase}</SubmitButton>
        </>
      }
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={référence} />
      <input type="hidden" name="usecase" value={usecase} />

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
