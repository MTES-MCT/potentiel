'use client';

import { FC, useState } from 'react';
import Stepper from '@codegouvfr/react-dsfr/Stepper';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import {
  corrigerReprésentantLégalAction,
  CorrigerReprésentantLégalFormKeys,
} from './corrigerReprésentantLégal.action';
import {
  SaisieCorrectionReprésentantLégalStep,
  SaisieTypePersonneStep,
  ValidationStep,
} from './steps';

export type TypeDePersonne = 'Personne physique' | 'Personne morale' | 'Collectivité' | 'Autre';

export type ReprésentantLégal = {
  typePersonne?: TypeDePersonne;
  nomReprésentantLégal: string;
};

export type CorrigerReprésentantLégalFormProps = {
  identifiantProjet: string;
  représentantLégalExistant: ReprésentantLégal;
};

export const CorrigerReprésentantLégalForm: FC<CorrigerReprésentantLégalFormProps> = ({
  identifiantProjet,
  représentantLégalExistant,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<CorrigerReprésentantLégalFormKeys>
  >({});

  const [currentStep, setCurrentStep] = useState(1);

  const [saisie, setSaisie] = useState<ReprésentantLégal>({
    typePersonne: représentantLégalExistant.typePersonne,
    nomReprésentantLégal: représentantLégalExistant.nomReprésentantLégal,
  });

  const steps: Array<Step> = [
    {
      index: 1,
      name: `Description de la démarche`,
      children: (
        <SaisieTypePersonneStep
          représentantLégalExistant={saisie}
          onChange={(représentantLégalÀJour) => setSaisie(représentantLégalÀJour)}
          validationErrors={validationErrors}
        />
      ),
      nextStep: { type: 'link', name: 'Commencer', disabled: !saisie.typePersonne },
    },
    {
      index: 2,
      name: `Renseigner les informations concernant le changement`,
      children: (
        <SaisieCorrectionReprésentantLégalStep
          représentantLégalExistant={saisie}
          validationErrors={validationErrors}
          onChange={(représentantLégalÀJour) => setSaisie(représentantLégalÀJour)}
        />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: {
        type: 'link',
        name: 'Vérifier',
        disabled:
          !saisie.nomReprésentantLégal ||
          saisie.nomReprésentantLégal === représentantLégalExistant.nomReprésentantLégal,
      },
    },
    {
      index: 3,
      name: `Confirmer la correction`,
      children: <ValidationStep représentantLégal={saisie} />,
      previousStep: { name: 'Corriger' },
      nextStep: {
        type: 'submit',
        name: 'Corriger le représentant légal',
        disabled: !saisie.typePersonne || !saisie.nomReprésentantLégal,
      },
    },
  ];

  const handleOnValidationError = (
    vErrors: ValidationErrors<CorrigerReprésentantLégalFormKeys>,
  ) => {
    if (Object.keys(validationErrors).length) {
      return;
    }

    vErrors.typeDePersonne && setCurrentStep(1);
    vErrors.nomRepresentantLegal && setCurrentStep(2);

    setValidationErrors(vErrors);
  };

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
        action={corrigerReprésentantLégalAction}
        onInvalid={() => setCurrentStep(2)}
        onError={() => setCurrentStep(2)}
        onValidationError={(vErrors) => handleOnValidationError(vErrors)}
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
