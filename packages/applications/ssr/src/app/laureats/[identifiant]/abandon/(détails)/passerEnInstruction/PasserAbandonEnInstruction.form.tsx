'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { passerAbandonEnInstructionAction } from './passerAbandonEnInstruction.action';

type PasserAbandonEnInstructionFormProps = {
  identifiantProjet: string;
  estUneReprise: boolean;
};

export const PasserAbandonEnInstruction = ({
  identifiantProjet,
  estUneReprise,
}: PasserAbandonEnInstructionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const label = estUneReprise
    ? "Êtes-vous sûr de vouloir reprendre l'instruction de l'abandon ?"
    : 'Êtes-vous sûr de vouloir passer cet abandon en instruction ?';
  const acceptButtonLabel = estUneReprise ? "Reprendre l'instruction" : 'Instruire';

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        {acceptButtonLabel}
      </Button>

      <ModalWithForm
        id="passer-abandon-en-instruction"
        title="Passer l'abandon en instruction"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: passerAbandonEnInstructionAction,
          id: 'passer-abandon-en-instruction-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">{label}</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
