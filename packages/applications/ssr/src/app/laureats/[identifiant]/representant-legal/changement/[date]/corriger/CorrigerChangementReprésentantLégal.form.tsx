'use client';

import { type FC, useState } from 'react';

import type { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import { DemandeInfosBox } from '../../../_helpers/DemandeInfosBox';
import {
  SaisieNomStep,
  SaisiePièceJustificativeStep,
  SaisieTypeStep,
} from '../../../_helpers/steps';
import {
  type CorrigerChangementReprésentantLégalFormKeys,
  corrigerChangementReprésentantLégalAction,
} from './corrigerChangementReprésentantLégal.action';

export type CorrigerChangementReprésentantLégalFormProps = PlainType<{
  identifiantProjet: IdentifiantProjet.ValueType;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['typeReprésentantLégal'];
  nomReprésentantLégal: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['nomReprésentantLégal'];
  pièceJustificative: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['pièceJustificative'];
  dateDemande: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['demandéeLe'];
  règlesInstructionautomatique?: AppelOffre.RègleInstructionAutomatique;
}>;

type CorrigerChangementReprésentantLégalState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  estEnCoursDeConstitution: boolean;
};

export const CorrigerChangementReprésentantLégalForm: FC<
  CorrigerChangementReprésentantLégalFormProps
> = ({
  identifiantProjet,
  typeReprésentantLégal,
  nomReprésentantLégal,
  pièceJustificative,
  dateDemande,
  règlesInstructionautomatique,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerChangementReprésentantLégalFormKeys>
  >({});
  const [state, setState] = useState<CorrigerChangementReprésentantLégalState>({
    typeReprésentantLégal: typeReprésentantLégal.type,
    estEnCoursDeConstitution: false,
  });

  return (
    <Form
      action={corrigerChangementReprésentantLégalAction}
      onValidationError={(validationErrors) => {
        setValidationErrors(validationErrors);
      }}
      actionButtons={{
        submitLabel: 'Corriger',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input type="hidden" value={DateTime.bind(dateDemande).formatter()} name="dateDemande" />

      <input
        type={'hidden'}
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
        name="identifiantProjet"
      />

      <div className="flex flex-col gap-6">
        <SaisieTypeStep
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
          typeReprésentantLégal={state.typeReprésentantLégal}
          nomReprésentantLégal={nomReprésentantLégal}
          validationErrors={validationErrors}
        />
        <SaisiePièceJustificativeStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          estEnCoursDeConstitution={state.estEnCoursDeConstitution}
          pièceJustificative={[DocumentProjet.bind(pièceJustificative).formatter()]}
          validationErrors={validationErrors}
        />
        {règlesInstructionautomatique && (
          <DemandeInfosBox règlesInstructionAutomatique={règlesInstructionautomatique} />
        )}
      </div>
    </Form>
  );
};
