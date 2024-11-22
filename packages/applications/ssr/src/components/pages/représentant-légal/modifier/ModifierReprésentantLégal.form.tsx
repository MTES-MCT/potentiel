'use client';

import { FC, useState } from 'react';
import Stepper from '@codegouvfr/react-dsfr/Stepper';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { Step, Steps } from '@/components/molecules/step/Steps';

import {
  modifierReprésentantLégalAction,
  ModifierReprésentantLégalFormKeys,
} from './modifierReprésentantLégal.action';
import {
  SaisieCorrectionReprésentantLégalStep as SaisieNomReprésentantLégalStep,
  SaisieTypePersonneStep,
  ValidationStep,
} from './steps';
import { ModifierReprésentantLégalPageProps } from './ModifierReprésentantLégal.page';

export type ModifierReprésentantLégalFormProps = ModifierReprésentantLégalPageProps;

export const ModifierReprésentantLégalForm: FC<ModifierReprésentantLégalFormProps> = ({
  identifiantProjet,
  nomReprésentantLégal,
  typeReprésentantLégal,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierReprésentantLégalFormKeys>
  >({});

  const [currentStep, setCurrentStep] = useState(1);

  const [type, setType] = useState(typeReprésentantLégal.type);
  const [nom, setNom] = useState(nomReprésentantLégal);

  const steps: Array<Step> = [
    {
      index: 1,
      name: `Description de la démarche`,
      children: (
        <SaisieTypePersonneStep
          typeReprésentantLégal={type}
          onChange={(nouveauType) => setType(nouveauType)}
          validationErrors={validationErrors}
        />
      ),
      nextStep: { type: 'link', name: 'Commencer', disabled: !typeReprésentantLégal },
    },
    {
      index: 2,
      name: `Renseigner les informations concernant le changement`,
      children: (
        <SaisieNomReprésentantLégalStep
          nomReprésentantLégal={nom}
          typeReprésentantLégal={type}
          validationErrors={validationErrors}
          onChange={(nouveauNom) => setNom(nouveauNom)}
        />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: {
        type: 'link',
        name: 'Vérifier',
        disabled: !nomReprésentantLégal || nom === nomReprésentantLégal,
      },
    },
    {
      index: 3,
      name: `Confirmer la correction`,
      children: <ValidationStep typeReprésentantLégal={type} nomReprésentantLégal={nom} />,
      previousStep: { name: 'Corriger' },
      nextStep: {
        type: 'submit',
        name: 'Corriger le représentant légal',
        disabled: !type || !nom,
      },
    },
  ];

  const handleOnValidationError = (
    vErrors: ValidationErrors<ModifierReprésentantLégalFormKeys>,
  ) => {
    if (Object.keys(validationErrors).length) {
      return;
    }

    vErrors.typeRepresentantLegal && setCurrentStep(1);
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
        action={modifierReprésentantLégalAction}
        onInvalid={() => setCurrentStep(2)}
        onError={() => setCurrentStep(2)}
        onValidationError={(vErrors) => handleOnValidationError(vErrors)}
        actions={null}
        omitMandatoryFieldsLegend={currentStep !== 2 ? true : undefined}
      >
        <input
          type={'hidden'}
          value={IdentifiantProjet.bind(identifiantProjet).formatter()}
          name="identifiantProjet"
        />
        <Steps
          steps={steps}
          currentStep={currentStep}
          onStepSelected={(stepIndex) => setCurrentStep(stepIndex)}
        />
      </Form>
    </>
  );
};
