'use client';

import { FC } from 'react';
import { Stepper } from '@codegouvfr/react-dsfr/Stepper';
import { StatutBadge } from '@/components/molecules/StatutBadge';

export type EtapesAbandon = {
  statut: string;
  abandonAvecRecandidature?: true;
};

const getCurrentStep = (statut: string, abandonAvecRecandidature?: true) => {
  if (abandonAvecRecandidature) {
    return statut === 'demandé' ? 1 : 2;
  }
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

const getNextStepTitle = (statut: string, abandonAvecRecandidature?: true) => {
  if (abandonAvecRecandidature) {
    return statut === 'demandé' ? 'instruction finale' : '';
  }
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

export const EtapesAbandon: FC<EtapesAbandon> = ({ statut, abandonAvecRecandidature }) => {
  return (
    <Stepper
      currentStep={getCurrentStep(statut, abandonAvecRecandidature)}
      nextTitle={getNextStepTitle(statut, abandonAvecRecandidature)}
      stepCount={abandonAvecRecandidature ? 2 : 4}
      title={<div className="mb-2">{StatutBadge({ statut })}</div>}
    />
  );
};
