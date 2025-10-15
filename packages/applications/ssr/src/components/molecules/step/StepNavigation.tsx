'use client';
import Button from '@codegouvfr/react-dsfr/Button';
import { FC } from 'react';

import { SubmitButton } from '@/components/atoms/form/SubmitButton';

type StepNavigationProps = {
  onStepSelected: (stepIndex: number) => void;
  previousStep?: {
    index: number;
    name: string;
  };
  nextStep: {
    name: string;
    disabled: boolean;
  } & (
    | {
        index: number;
        type: 'link';
      }
    | {
        type: 'submit';
      }
  );
};
export const StepNavigation: FC<StepNavigationProps> = ({
  onStepSelected,
  previousStep,
  nextStep,
}) => (
  <div className="flex w-full pt-3 gap-4 border-t-2 border-t-dsfr-border-default-grey-default">
    {previousStep && (
      <Button type="button" priority="secondary" onClick={() => onStepSelected(previousStep.index)}>
        {previousStep.name}
      </Button>
    )}

    {nextStep.type === 'link' ? (
      <Button
        type="button"
        className="flex ml-auto"
        priority="secondary"
        onClick={() => onStepSelected(nextStep.index)}
        disabled={nextStep.disabled}
      >
        {nextStep.name}
      </Button>
    ) : (
      <SubmitButton classname="flex ml-auto" disabled={nextStep.disabled}>
        {nextStep.name}
      </SubmitButton>
    )}
  </div>
);
