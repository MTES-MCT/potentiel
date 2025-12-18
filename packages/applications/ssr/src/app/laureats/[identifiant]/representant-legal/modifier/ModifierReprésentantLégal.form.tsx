'use client';

import { FC, useEffect, useState } from 'react';
import Stepper from '@codegouvfr/react-dsfr/Stepper';
import Input from '@codegouvfr/react-dsfr/Input';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import { SaisieNomStep, SaisieTypeStep, TypeSociété, ValidationStep } from '../_helpers/steps';

import {
  modifierReprésentantLégalAction,
  ModifierReprésentantLégalFormKeys,
} from './modifierReprésentantLégal.action';
import { ModifierReprésentantLégalPageProps } from './ModifierReprésentantLégal.page';

export type ModifierReprésentantLégalFormProps = ModifierReprésentantLégalPageProps;

type ModifierReprésentantLégalState = {
  step: number;
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété: TypeSociété;
  nomReprésentantLégal: string;
  raison: string;
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
    step: 1,
    nomReprésentantLégal,
    typeReprésentantLégal: typeReprésentantLégal.type,
    typeSociété: 'non renseignée',
    raison: '',
  });

  const conditionDésactivationÉtape1 =
    !state.typeReprésentantLégal ||
    (state.typeReprésentantLégal === 'personne-morale' && state.typeSociété === 'non renseignée') ||
    state.typeReprésentantLégal === 'inconnu';

  const conditionDésactivationÉtape2 =
    !state.nomReprésentantLégal ||
    state.nomReprésentantLégal === nomReprésentantLégal ||
    !state.raison;

  const conditionDésactivationÉtape3 = !state.typeReprésentantLégal || !state.nomReprésentantLégal;

  const steps: Array<Step> = [
    {
      index: 1,
      name: `Description de la démarche`,
      children: (
        <div className="flex flex-col gap-4">
          <p>
            Pour effectuer une modification du représentant légal, vous devez tout d'abord
            sélectionner le type du nouveau représentant légal pour prendre connaissance des
            documents à fournir.
          </p>
          <SaisieTypeStep
            contexte="modifier"
            typeReprésentantLégal={state.typeReprésentantLégal}
            typeSociété={state.typeSociété}
            onChange={({ typeReprésentantLégal, typeSociété }) =>
              setState((state) => ({ ...state, typeReprésentantLégal, typeSociété }))
            }
            validationErrors={validationErrors}
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
        <>
          <SaisieNomStep
            nomReprésentantLégal={state.nomReprésentantLégal}
            typeReprésentantLégal={state.typeReprésentantLégal}
            onChange={(nomReprésentantLégal) =>
              setState((state) => ({ ...state, nomReprésentantLégal }))
            }
            validationErrors={validationErrors}
          />
          <Input
            className="mt-4"
            label="Raison"
            id="raison"
            hintText={`Veuillez préciser les raisons de ce changement`}
            state={validationErrors['raison'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['raison']}
            nativeInputProps={{
              name: 'raison',
              required: true,
              'aria-required': true,
              onChange: ({ target: { value } }) => {
                delete validationErrors.raison;
                setState((state) => ({ ...state, raison: value }));
              },
            }}
          />
        </>
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
          raison={state.raison}
          message={`Vous êtes sur le point de modifier le représentant légal du projet. Veuillez vérifier l'ensemble des informations saisies et confirmer si tout est correct.`}
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

  useEffect(() => {
    if (validationErrors['typeRepresentantLegal']) {
      setState((state) => ({ ...state, step: 1 }));
    }

    if (validationErrors['nomRepresentantLegal']) {
      setState((state) => ({ ...state, step: 2 }));
    }
  }, [validationErrors]);

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
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
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
