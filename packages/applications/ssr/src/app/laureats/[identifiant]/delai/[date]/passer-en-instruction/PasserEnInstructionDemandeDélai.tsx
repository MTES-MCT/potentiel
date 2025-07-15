'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { passerEnInstructionDemandeDélaiAction } from './passerEnInstructionDemandeDélai.action';

type PasserEnInstructionDemandeDélaiFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const PasserEnInstructionDemandeDélai = ({
  identifiantProjet,
}: PasserEnInstructionDemandeDélaiFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Passer en instruction
      </Button>

      <ModalWithForm
        id="passer-en-instruction-demande-délai"
        title="Passer la demande de délai en instruction"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: passerEnInstructionDemandeDélaiAction,
          id: 'passer-en-instruction-demande-délai-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir passer en instruction la demande de délai ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
