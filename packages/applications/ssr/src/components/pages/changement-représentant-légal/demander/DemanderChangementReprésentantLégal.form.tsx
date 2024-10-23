'use client';

import { FC, useState } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import { StepProps, Steps } from './Steps';
import { Description } from './Description';
import { Saisie } from './Saisie';
import { Validation } from './Validation';
import {
  demanderChangementReprésentantLégalAction,
  DemanderChangementReprésentantLégalFormKeys,
} from './demanderChangementReprésentantLégal.action';

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
  const [saisie, setSaisie] = useState<Saisie>({
    typePersonne: undefined,
    nomReprésentantLégal: '',
    piècesJustificatives: [],
  });

  const steps: Array<StepProps> = [
    {
      index: 1,
      name: `Description de la démarche en cours`,
      children: <Description />,
      nextStep: { type: 'link', name: 'Commencer' },
    },
    {
      index: 2,
      name: `Renseigner les informations concernant le changement`,
      children: (
        <Saisie validationErrors={validationErrors} onChanged={(changes) => setSaisie(changes)} />
      ),
      previousStep: { name: 'Précédent' },
      nextStep: { type: 'link', name: 'Vérifier' },
    },
    {
      index: 3,
      name: `Confirmer la demande de changement`,
      children: (
        <Validation
          typePersonne={saisie.typePersonne}
          nomReprésentantLégal={saisie.nomReprésentantLégal}
          piècesJustificatives={saisie.piècesJustificatives}
        />
      ),
      previousStep: { name: 'Corriger' },
      nextStep: { type: 'submit', name: 'Confirmer la demande' },
    },
  ];

  return (
    <>
      <Stepper
        currentStep={currentStep}
        nextTitle={currentStep < steps.length && steps[currentStep].name}
        stepCount={steps.length}
        title={steps[currentStep - 1].name}
      />

      <Form
        action={demanderChangementReprésentantLégalAction}
        method="POST"
        encType="multipart/form-data"
        onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
        actions={null}
        omitMandatoryFieldsLegend={currentStep !== 2 ? true : undefined}
      >
        <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

        <Steps onStepSelected={(stepIndex) => setCurrentStep(stepIndex)} steps={steps} />
      </Form>
    </>
  );
};
