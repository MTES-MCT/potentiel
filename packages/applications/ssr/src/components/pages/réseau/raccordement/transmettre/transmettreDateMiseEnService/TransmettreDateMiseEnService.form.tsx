'use client';

import { FC, useState } from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';

import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import {
  transmettreDateMiseEnServiceAction,
  TransmettreDateMiseEnServiceStateFormKeys,
} from './transmettreDateMiseEnService.action';

export type TransmettreDateMiseEnServiceFormProps = {
  projet: {
    identifiantProjet: string;
    dateDésignation: Iso8601DateTime;
  };
  dossierRaccordement: {
    référence: string;
    miseEnService?: Iso8601DateTime;
  };
  lienRetour: string;
};

export const TransmettreDateMiseEnServiceForm: FC<TransmettreDateMiseEnServiceFormProps> = ({
  projet: { identifiantProjet, dateDésignation },
  dossierRaccordement: { référence, miseEnService },
  lienRetour,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettreDateMiseEnServiceStateFormKeys>
  >({});

  return (
    <Form
      action={transmettreDateMiseEnServiceAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: lienRetour,
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour aux dossiers de raccordement
          </Button>
          <SubmitButton>Transmettre</SubmitButton>
        </>
      }
    >
      <input type="hidden" name="identifiantProjet" value={identifiantProjet} />
      <input type="hidden" name="referenceDossier" value={référence} />
      <input type="hidden" name="dateDesignation" value={dateDésignation} />

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
