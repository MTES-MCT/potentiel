'use client';

import { Button } from '@codegouvfr/react-dsfr/Button';
import { type FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { type Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import type { ValidationErrors } from '@/utils/formAction';
import {
  type TransmettreDateMiseEnServiceStateFormKeys,
  transmettreDateMiseEnServiceAction,
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
          <SubmitButton>Transmettre</SubmitButton>
        </>
      }
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
        state={validationErrors.dateMiseEnService ? 'error' : 'default'}
        stateRelatedMessage={validationErrors.dateMiseEnService}
      />
    </Form>
  );
};
