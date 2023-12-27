'use client';

import { FC } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';
import { StatutBadge } from '@/components/molecules/StatutBadge';

export type EtapesAbandon = {
  statut: string;
};

const getCurrentStep = (statut: string) => {
  switch (statut) {
    case 'demandé':
      return 1;
    case 'confirmation-demandée':
      return 2;
    case 'confirmé':
      return 3;
    case 'accordé':
    case 'rejeté':
      return 4;

    default:
      return 1;
  }
};

const getNextStepTitle = (statut: string) => {
  switch (statut) {
    case 'demandé':
      return 'demande de confirmation';
    case 'confirmation-demandée':
      return 'confirmation';
    case 'confirmé':
      return 'instruction finale';
    default:
      return '';
  }
};

export const EtapesAbandon: FC<EtapesAbandon> = ({ statut }) => {
  return (
    <Stepper
      currentStep={getCurrentStep(statut)}
      nextTitle={getNextStepTitle(statut)}
      stepCount={4}
      title={<div className="mb-2">{StatutBadge({ statut })}</div>}
    />
  );
};
