'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { passerRecoursEnInstructionAction } from './passerRecoursEnInstruction.action';

type PasserRecoursEnInstructionFormProps = {
  identifiantProjet: string;
};

export const PasserRecoursEnInstruction = ({
  identifiantProjet,
}: PasserRecoursEnInstructionFormProps) => {
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
        id="passer-recours-en-instruction"
        title="Passer le recours en instruction"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: passerRecoursEnInstructionAction,
          id: 'passer-recours-en-instruction-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir passer ce recours en instruction ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
