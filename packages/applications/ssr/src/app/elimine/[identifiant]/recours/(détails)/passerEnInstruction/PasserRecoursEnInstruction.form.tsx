'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { passerRecoursEnInstructionAction } from './passerRecoursEnInstruction.action';

type PasserRecoursEnInstructionFormProps = {
  identifiantProjet: string;
  estUneReprise: boolean;
};

export const PasserRecoursEnInstruction = ({
  identifiantProjet,
  estUneReprise,
}: PasserRecoursEnInstructionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const label = estUneReprise
    ? "Êtes-vous sûr de vouloir reprendre l'instruction du recours ?"
    : 'Êtes-vous sûr de vouloir passer ce recours en instruction ?';
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
        id="passer-recours-en-instruction"
        title="Passer le recours en instruction"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: passerRecoursEnInstructionAction,
          id: 'passer-recours-en-instruction-form',
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
