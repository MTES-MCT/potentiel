'use client';

import { FC, useState } from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { Form, FormProps } from '@/components/atoms/form/Form';
import { InputDate } from '@/components/atoms/form/InputDate';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

export type EnregistrerDateMiseEnServiceFormProps = {
  action: FormProps['action'];
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
  action,
  projet: { identifiantProjet, dateDésignation },
  dossierRaccordement: { référence, miseEnService },
}) => {
  const [validationErrors, setValidationErrors] = useState<ValidationErrors<'dateMiseEnService'>>(
    {},
  );

  return (
    <Form
      action={action}
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
          <SubmitButton classname="capitalize">Soumettre</SubmitButton>
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
        state={validationErrors['dateMiseEnService'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateMiseEnService']}
      />
    </Form>
  );
};
