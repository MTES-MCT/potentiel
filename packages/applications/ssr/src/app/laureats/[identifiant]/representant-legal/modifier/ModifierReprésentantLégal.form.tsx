'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { type FC, useState } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { SaisieNomStep, SaisieTypeStep } from '../_helpers/steps';
import type { ModifierReprésentantLégalPageProps } from './ModifierReprésentantLégal.page';
import {
  type ModifierReprésentantLégalFormKeys,
  modifierReprésentantLégalAction,
} from './modifierReprésentantLégal.action';

export type ModifierReprésentantLégalFormProps = ModifierReprésentantLégalPageProps;

type ModifierReprésentantLégalState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  estEnCoursDeConstitution: boolean;
};

export const ModifierReprésentantLégalForm: FC<ModifierReprésentantLégalFormProps> = ({
  identifiantProjet,
  nomReprésentantLégal,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierReprésentantLégalFormKeys>
  >({});

  const [state, setState] = useState<ModifierReprésentantLégalState>({
    typeReprésentantLégal: 'inconnu',
    estEnCoursDeConstitution: false,
  });

  return (
    <Form
      action={modifierReprésentantLégalAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
        },
        submitDisabled: state.typeReprésentantLégal === 'inconnu',
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <div className="flex flex-col gap-4">
        <SaisieTypeStep
          estUneModificationAdmin={true}
          typeReprésentantLégal={state.typeReprésentantLégal}
          estEnCoursDeConstitution={state.estEnCoursDeConstitution}
          validationErrors={validationErrors}
          onChange={({ typeReprésentantLégal, estEnCoursDeConstitution }) => {
            setState((state) => ({
              ...state,
              typeReprésentantLégal,
              estEnCoursDeConstitution,
            }));
          }}
        />

        <SaisieNomStep
          nomReprésentantLégal={nomReprésentantLégal}
          typeReprésentantLégal={state.typeReprésentantLégal}
          validationErrors={validationErrors}
        />

        <Input
          label="Raison"
          id="raison"
          hintText="Veuillez préciser les raisons de ce changement"
          state={validationErrors['raison'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['raison']}
          nativeInputProps={{
            name: 'raison',
            required: true,
            'aria-required': true,
          }}
        />
      </div>
    </Form>
  );
};
