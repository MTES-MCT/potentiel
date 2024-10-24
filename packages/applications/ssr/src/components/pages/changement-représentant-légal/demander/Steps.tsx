'use client';
import { ReactNode, FC, useState } from 'react';

import { StepNavigation } from './StepNavigation';

export type Step = {
  index: number;
  name: string;
  children: ReactNode;
  previousStep?: { name: string };
  nextStep: { name: string; type: 'link' | 'submit' };
};

export type StepsProps = {
  onStepSelected?: (stepIndex: number) => void;
  steps: Array<Step>;
};

export const Steps: FC<StepsProps> = ({ onStepSelected, steps }) => {
  const [selectedStep, selectStep] = useState(1);

  return (
    <ul className="flex flex-col">
      {steps.map((step) => (
        <li className={selectedStep !== step.index ? 'hidden' : 'flex flex-col gap-5'}>
          <div>{step.children}</div>
          <StepNavigation
            onStepSelected={(stepIndex) => {
              selectStep(stepIndex);
              onStepSelected && onStepSelected(stepIndex);
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
