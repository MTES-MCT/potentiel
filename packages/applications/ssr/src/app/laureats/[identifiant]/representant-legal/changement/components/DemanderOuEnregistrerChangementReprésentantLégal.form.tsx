'use client';

import { type FC, useState } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { DemandeInfosBox } from '../../_helpers/DemandeInfosBox';
import type { DemanderOuEnregistrerChangementReprésentantLégalFormKeys } from '../../_helpers/schema';
import {
  SaisieNomStep,
  SaisiePièceJustificativeStep,
  SaisieTypeAndSociétéStep,
  type TypeSociété,
} from '../../_helpers/steps';
import { demanderChangementReprésentantLégalAction } from '../demander/demanderChangementReprésentantLégal.action';
import { enregistrerChangementReprésentantLégalAction } from '../enregistrer/enregistrerChangementReprésentantLégal.action';

type DemanderOuEnregistrerChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
  estUneDemande: boolean;
};

type DemanderOuEnregistrerChangementReprésentantLégalState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export const DemanderOuEnregistrerChangementReprésentantLégalForm: FC<
  DemanderOuEnregistrerChangementReprésentantLégalFormProps
> = ({ identifiantProjet, estUneDemande }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderOuEnregistrerChangementReprésentantLégalFormKeys>
  >({});

  const [state, setState] = useState<DemanderOuEnregistrerChangementReprésentantLégalState>({
    typeReprésentantLégal: 'inconnu',
    typeSociété: 'non renseignée',
  });

  return (
    <Form
      action={
        estUneDemande
          ? demanderChangementReprésentantLégalAction
          : enregistrerChangementReprésentantLégalAction
      }
      onValidationError={(validationErrors) => {
        setValidationErrors(validationErrors);
      }}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
      <div className="flex flex-col gap-2">
        <SaisieTypeAndSociétéStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          typeSociété={state.typeSociété}
          validationErrors={validationErrors}
          onChange={({ typeReprésentantLégal, typeSociété }) => {
            setValidationErrors((validationErrors) => ({
              ...validationErrors,
              typeRepresentantLegal: undefined,
            }));
            setState((state) => ({
              ...state,
              typeReprésentantLégal,
              typeSociété,
            }));
          }}
        />
        <SaisieNomStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          nomReprésentantLégal=""
          validationErrors={validationErrors}
        />
        <SaisiePièceJustificativeStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          typeSociété={state.typeSociété}
          validationErrors={validationErrors}
        />
        {estUneDemande && <DemandeInfosBox />}
      </div>
    </Form>
  );
};
