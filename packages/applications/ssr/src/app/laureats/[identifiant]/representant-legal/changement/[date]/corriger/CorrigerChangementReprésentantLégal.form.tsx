'use client';

import { type FC, useState } from 'react';

import { DateTime } from '@potentiel-domain/common';
import type { PlainType } from '@potentiel-domain/core';
import { DocumentProjet, IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import type { ValidationErrors } from '@/utils/formAction';
import {
  SaisieNomStep,
  SaisiePièceJustificativeStep,
  SaisieTypeStep,
  type TypeSociété,
} from '../../../_helpers/steps';
import {
  type CorrigerChangementReprésentantLégalFormKeys,
  corrigerChangementReprésentantLégalAction,
} from './corrigerChangementReprésentantLégal.action';

export type CorrigerChangementReprésentantLégalFormProps = PlainType<{
  identifiantProjet: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['identifiantProjet'];
  typeReprésentantLégal: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['typeReprésentantLégal'];
  nomReprésentantLégal: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['nomReprésentantLégal'];
  pièceJustificative: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['pièceJustificative'];
  dateDemande: Lauréat.ReprésentantLégal.ConsulterChangementReprésentantLégalReadModel['demande']['demandéeLe'];
}>;

type CorrigerChangementReprésentantLégalState = {
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
};

export const CorrigerChangementReprésentantLégalForm: FC<
  CorrigerChangementReprésentantLégalFormProps
> = ({
  identifiantProjet,
  typeReprésentantLégal,
  nomReprésentantLégal,
  pièceJustificative,
  dateDemande,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerChangementReprésentantLégalFormKeys>
  >({});
  const [state, setState] = useState<CorrigerChangementReprésentantLégalState>({
    typeReprésentantLégal: typeReprésentantLégal.type,
    typeSociété: 'non renseignée',
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

      <div>
        <SaisieTypeStep
          contexte="corriger"
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
          typeReprésentantLégal={state.typeReprésentantLégal}
          nomReprésentantLégal={nomReprésentantLégal}
          validationErrors={validationErrors}
        />
        <SaisiePièceJustificativeStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          typeSociété={state.typeSociété}
          pièceJustificative={[DocumentProjet.bind(pièceJustificative).formatter()]}
          validationErrors={validationErrors}
        />
        {/* <Notice */}
        {/* //           message={`
          //   Vous êtes sur le point de corriger la demande de changement du représentant légal du projet. 
          //   Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est correct.
          //   Ensuite votre demande sera alors instruite par le service de l'état en région de votre projet. 
          //   À défaut de réponse, votre demande sera réputée accordée ou rejetée conformément aux
          //   règles du cahier des charges en vigueur de votre projet.`} */}
      </div>
    </Form>
  );
};
