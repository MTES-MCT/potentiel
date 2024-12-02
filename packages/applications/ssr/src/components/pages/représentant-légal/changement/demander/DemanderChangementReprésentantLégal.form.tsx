'use client';

import { FC, useState } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import {
  demanderChangementReprésentantLégalAction,
  DemanderChangementReprésentantLégalFormKeys,
} from './demanderChangementReprésentantLégal.action';
import {
  DescriptionDémarcheChangementReprésentantLégal,
  SaisieChangementReprésentantLégal,
  ValidationChangementReprésentantLégal,
} from './steps';

export type DemanderChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
};

export const DemanderChangementReprésentantLégalForm: FC<
  DemanderChangementReprésentantLégalFormProps
> = ({ identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementReprésentantLégalFormKeys>
  >({});

  const [currentStep, setCurrentStep] = useState(1);
  const [saisie, setSaisie] = useState<SaisieChangementReprésentantLégal>({
    typePersonne: undefined,
    nomReprésentantLégal: '',
    piècesJustificatives: [],
  });

  const disabledCondition =
    !saisie.typePersonne || !saisie.nomReprésentantLégal || !saisie.piècesJustificatives.length;

  const steps: Array<Step> = [
    {
      index: 1,
      name: `Description de la démarche`,
      children: <DescriptionDémarcheChangementReprésentantLégal />,
      nextStep: { type: 'link', name: 'Commencer', disabled: false },
    },
    {
      index: 2,
      name: `Renseigner les informations concernant le changement`,
      children: (
        <SaisieChangementReprésentantLégal
          validationErrors={validationErrors}
          onChange={(changes) => setSaisie(changes)}
        />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: {
        type: 'link',
        name: 'Vérifier',
        disabled: disabledCondition,
      },
    },
    {
      index: 3,
      name: `Confirmer la demande de changement`,
      children: (
        <ValidationChangementReprésentantLégal
          typePersonne={saisie.typePersonne}
          nomReprésentantLégal={saisie.nomReprésentantLégal}
          piècesJustificatives={saisie.piècesJustificatives}
        />
      ),
      previousStep: { name: 'Corriger' },
      nextStep: { type: 'submit', name: 'Confirmer la demande', disabled: disabledCondition },
    },
  ];

  return (
    <>
      <Stepper
        className="my-10"
        currentStep={currentStep}
        nextTitle={currentStep < steps.length && steps[currentStep].name}
        stepCount={steps.length}
        title={steps[currentStep - 1].name}
      />

      <Form
        action={demanderChangementReprésentantLégalAction}
        onInvalid={() => setCurrentStep(2)}
        onValidationError={(validationErrors) => {
          setValidationErrors(validationErrors);
          setCurrentStep(2);
        }}
        onError={() => setCurrentStep(2)}
        actions={null}
        omitMandatoryFieldsLegend={currentStep !== 2 ? true : undefined}
      >
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

        <Steps
          steps={steps}
          currentStep={currentStep}
          onStepSelected={(stepIndex) => setCurrentStep(stepIndex)}
        />
      </Form>
    </>
  );
};
