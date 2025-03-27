'use client';

import { FC, useState } from 'react';
import Stepper from '@codegouvfr/react-dsfr/Stepper';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import { SaisieNomStep, SaisieTypeStep, ValidationStep } from '../_utils/steps';
import { TypeSociété } from '../_utils/steps/SaisieTypeSociété.step';

import {
  modifierReprésentantLégalAction,
  ModifierReprésentantLégalFormKeys,
} from './modifierReprésentantLégal.action';
import { ModifierReprésentantLégalPageProps } from './ModifierReprésentantLégal.page';

export type ModifierReprésentantLégalFormProps = ModifierReprésentantLégalPageProps;

type ModifierReprésentantLégalState = {
  step: number;
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  nomReprésentantLégal: string;
  validationErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>;
};

export const ModifierReprésentantLégalForm: FC<ModifierReprésentantLégalFormProps> = ({
  identifiantProjet,
  nomReprésentantLégal,
  typeReprésentantLégal,
}) => {
  const [state, setState] = useState<ModifierReprésentantLégalState>({
    step: 1,
    nomReprésentantLégal,
    typeReprésentantLégal: typeReprésentantLégal.type,
    typeSociété: 'non renseignée',
    validationErrors: {},
  });

  const conditionDésactivationÉtape1 =
    !state.typeReprésentantLégal ||
    (state.typeReprésentantLégal === 'personne-morale' && state.typeSociété === 'non renseignée') ||
    state.typeReprésentantLégal === 'inconnu';

  const conditionDésactivationÉtape2 =
    !state.nomReprésentantLégal || state.nomReprésentantLégal === nomReprésentantLégal;

  const conditionDésactivationÉtape3 = !state.typeReprésentantLégal || !state.nomReprésentantLégal;

  const steps: Array<Step> = [
    {
      index: 1,
      name: `Description de la démarche`,
      children: (
        <div className="flex flex-col gap-4">
          <p>
            Pour effectuer une modification du représentant légal vous devez tout d'abord
            sélectionner le type du nouveau représentant légal pour connaître les documents
            obligatoires nécessaires à la modification.
          </p>
          <SaisieTypeStep
            contexte="modifier"
            typeReprésentantLégal={state.typeReprésentantLégal}
            typeSociété={state.typeSociété}
            onChange={({ typeReprésentantLégal, typeSociété }) =>
              setState((state) => ({ ...state, typeReprésentantLégal, typeSociété }))
            }
            validationErrors={state.validationErrors}
          />
        </div>
      ),
      nextStep: {
        type: 'link',
        name: 'Commencer',
        disabled: conditionDésactivationÉtape1,
      },
    },
    {
      index: 2,
      name: `Renseigner les informations concernant le changement`,
      children: (
        <SaisieNomStep
          nomReprésentantLégal={state.nomReprésentantLégal}
          typeReprésentantLégal={state.typeReprésentantLégal}
          validationErrors={state.validationErrors}
          onChange={(nomReprésentantLégal) =>
            setState((state) => ({ ...state, nomReprésentantLégal }))
          }
        />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: {
        type: 'link',
        name: 'Suivant',
        disabled: conditionDésactivationÉtape2,
      },
    },
    {
      index: 3,
      name: `Confirmer la modification`,
      children: (
        <ValidationStep
          typeReprésentantLégal={state.typeReprésentantLégal}
          typeSociété={state.typeSociété}
          nomReprésentantLégal={state.nomReprésentantLégal}
          piècesJustificatives={[]}
          message={`Vous êtes sur le point de modifier le représentant légal du projet. Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est correct`}
        />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: {
        type: 'submit',
        name: 'Modifier le représentant légal',
        disabled: conditionDésactivationÉtape3,
      },
    },
  ];

  const handleOnValidationError = (
    vErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>,
  ) => {
    if (Object.keys(state.validationErrors).length) {
      return;
    }

    vErrors.typeRepresentantLegal && setState((state) => ({ ...state, step: 1 }));
    vErrors.nomRepresentantLegal && setState((state) => ({ ...state, step: 2 }));

    setState((state) => ({
      ...state,
      validationErrors: {
        ...state.validationErrors,
        ...vErrors,
      },
    }));
  };

  return (
    <>
      <Stepper
        className="my-10"
        currentStep={state.step}
        nextTitle={state.step < steps.length && steps[state.step].name}
        stepCount={steps.length}
        title={steps[state.step - 1].name}
      />

      <Form
        action={modifierReprésentantLégalAction}
        onInvalid={() => setState((state) => ({ ...state, step: 1 }))}
        onError={() => setState((state) => ({ ...state, step: 1 }))}
        onValidationError={(vErrors) => handleOnValidationError(vErrors)}
        actions={null}
        omitMandatoryFieldsLegend={state.step === 3 ? undefined : true}
      >
        <input
          type={'hidden'}
          value={IdentifiantProjet.bind(identifiantProjet).formatter()}
          name="identifiantProjet"
        />
        <Steps
          steps={steps}
          currentStep={state.step}
          onStepSelected={(step) => setState((state) => ({ ...state, step }))}
        />
      </Form>
    </>
  );
};
