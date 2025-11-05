'use client';
import { ReactNode, FC } from 'react';

import { StepNavigation } from './StepNavigation';

export type Step = {
  index: number;
  name: string;
  children: ReactNode;
  previousStep?: { name: string };
  nextStep: { name: string; type: 'link' | 'submit'; disabled: boolean };
};

export type StepsProps = {
  currentStep: number;
  onStepSelected?: (stepIndex: number) => void;
  steps: Array<Step>;
};

export const Steps: FC<StepsProps> = ({ onStepSelected, steps, currentStep }) => {
  return (
    <ul className="flex flex-col">
      {steps.map((step, index) => (
        <li
          className={currentStep !== step.index ? 'hidden' : 'flex flex-col gap-5'}
          key={`step-${index}`}
        >
          <div>{step.children}</div>
          <StepNavigation
            onStepSelected={(stepIndex) => {
              if (onStepSelected) {
                onStepSelected(stepIndex);
              }
            }}
            previousStep={
              step.previousStep
                ? { index: currentStep - 1, name: step.previousStep.name }
                : undefined
            }
            nextStep={
              step.nextStep.type === 'link'
                ? {
                    index: currentStep + 1,
                    name: step.nextStep.name,
                    type: 'link',
                    disabled: step.nextStep.disabled,
                  }
                : { name: step.nextStep.name, type: 'submit', disabled: step.nextStep.disabled }
            }
          />
        </li>
      ))}
    </ul>
  );
};
