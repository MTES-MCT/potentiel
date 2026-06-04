'use client';

import Input from '@codegouvfr/react-dsfr/Input';
import { type FC, useState } from 'react';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { SaisieNomStep, SaisieTypeAndSociétéStep, type TypeSociété } from '../_helpers/steps';
import type { ModifierReprésentantLégalPageProps } from './ModifierReprésentantLégal.page';
import {
  type ModifierReprésentantLégalFormKeys,
  modifierReprésentantLégalAction,
} from './modifierReprésentantLégal.action';

export type ModifierReprésentantLégalFormProps = ModifierReprésentantLégalPageProps;

type ModifierReprésentantLégalState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export const ModifierReprésentantLégalForm: FC<ModifierReprésentantLégalFormProps> = ({
  identifiantProjet,
  nomReprésentantLégal,
  typeReprésentantLégal,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierReprésentantLégalFormKeys>
  >({});

  const [state, setState] = useState<ModifierReprésentantLégalState>({
    typeReprésentantLégal: typeReprésentantLégal.type,
    typeSociété: 'non renseignée',
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
      }}
    >
      <input
        type={'hidden'}
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
        name="identifiantProjet"
      />
      <div className="flex flex-col gap-4">
        <SaisieTypeAndSociétéStep
          estUneModificationAdmin={true}
          typeReprésentantLégal={state.typeReprésentantLégal}
          typeSociété={state.typeSociété}
          validationErrors={validationErrors}
          onChange={({ typeReprésentantLégal, typeSociété }) => {
            setState((state) => ({
              ...state,
              typeReprésentantLégal,
              typeSociété,
            }));
          }}
        />

        <SaisieNomStep
          nomReprésentantLégal={nomReprésentantLégal}
          typeReprésentantLégal={state.typeReprésentantLégal}
          validationErrors={validationErrors}
        />

        <Input
          className="mt-4"
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
