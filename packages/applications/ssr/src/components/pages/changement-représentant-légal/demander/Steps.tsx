'use client';
import { ReactNode, FC, useState } from 'react';

import { StepNavigation } from './StepNavigation';

export type StepProps = {
  index: number;
  name: string;
  children: ReactNode;
  previousStep?: { name: string };
  nextStep: { name: string; type: 'link' | 'submit' };
};

export const Steps: FC<{
  onStepSelected: (stepIndex: number) => void;
  steps: Array<StepProps>;
}> = ({ onStepSelected, steps }) => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <ul className="flex flex-col">
      {steps.map((step) => (
        <li className={currentStep !== step.index ? 'hidden' : 'flex flex-col gap-5'}>
          <div>{step.children}</div>
          <StepNavigation
            onStepSelected={(stepIndex) => {
              setCurrentStep(stepIndex);
              onStepSelected(stepIndex);
            }}
            previousStep={
              step.previousStep
                ? { index: step.index - 1, name: step.previousStep.name }
                : undefined
            }
            nextStep={
              step.nextStep.type === 'link'
                ? { index: step.index + 1, name: step.nextStep.name, type: 'link' }
                : { name: step.nextStep.name, type: 'submit' }
            }
          />
        </li>
      ))}
    </ul>
  );
};
