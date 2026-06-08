'use client';

import { type FC, useState } from 'react';

import type { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { DemandeInfosBox } from '../../_helpers/DemandeInfosBox';
import type { DemanderOuEnregistrerChangementReprésentantLégalFormKeys } from '../../_helpers/schema';
import { SaisieNomStep, SaisiePièceJustificativeStep, SaisieTypeStep } from '../../_helpers/steps';
import { demanderChangementReprésentantLégalAction } from '../demander/demanderChangementReprésentantLégal.action';
import { enregistrerChangementReprésentantLégalAction } from '../enregistrer/enregistrerChangementReprésentantLégal.action';

type DemanderOuEnregistrerChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
  estUneDemande: boolean;
};

type DemanderOuEnregistrerChangementReprésentantLégalState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  estEnCoursDeConstitution: boolean;
};

export const DemanderOuEnregistrerChangementReprésentantLégalForm: FC<
  DemanderOuEnregistrerChangementReprésentantLégalFormProps
> = ({ identifiantProjet, estUneDemande }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderOuEnregistrerChangementReprésentantLégalFormKeys>
  >({});

  const [state, setState] = useState<DemanderOuEnregistrerChangementReprésentantLégalState>({
    typeReprésentantLégal: 'inconnu',
    estEnCoursDeConstitution: false,
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
      <div className="flex flex-col gap-6">
        <SaisieTypeStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          estEnCoursDeConstitution={state.estEnCoursDeConstitution}
          validationErrors={validationErrors}
          onChange={({ typeReprésentantLégal, estEnCoursDeConstitution }) => {
            setValidationErrors((validationErrors) => ({
              ...validationErrors,
              typeRepresentantLegal: undefined,
            }));
            setState((state) => ({
              ...state,
              typeReprésentantLégal,
              estEnCoursDeConstitution,
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
          estEnCoursDeConstitution={state.estEnCoursDeConstitution}
          validationErrors={validationErrors}
        />
        {estUneDemande && <DemandeInfosBox />}
      </div>
    </Form>
    
  );
};
