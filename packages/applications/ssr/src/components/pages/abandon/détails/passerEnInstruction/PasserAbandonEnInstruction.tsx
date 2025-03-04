'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { passerAbandonEnInstructionAction } from './passerAbandonEnInstruction.action';

type PasserAbandonEnInstructionFormProps = {
  identifiantProjet: string;
};

export const PasserAbandonEnInstruction = ({
  identifiantProjet,
}: PasserAbandonEnInstructionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Instruire
      </Button>

      <ModalWithForm
        id="passer-abandon-en-instruction"
        title="Passer l'abandon en instruction"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: passerAbandonEnInstructionAction,
          id: 'passer-abandon-en-instruction-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir passer cet abandon en instruction ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
