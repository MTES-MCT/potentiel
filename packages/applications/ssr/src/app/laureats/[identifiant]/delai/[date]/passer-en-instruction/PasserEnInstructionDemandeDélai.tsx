'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { passerEnInstructionDemandeDélaiAction } from './passerEnInstructionDemandeDélai.action';

type PasserEnInstructionDemandeDélaiFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  dateDemande: DateTime.RawType;
  estUneReprise: boolean;
};

export const PasserEnInstructionDemandeDélai = ({
  identifiantProjet,
  dateDemande,
  estUneReprise,
}: PasserEnInstructionDemandeDélaiFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const label = estUneReprise
    ? "Êtes-vous sûr de vouloir reprendre l'instruction de la demande de délai ?"
    : 'Êtes-vous sûr de vouloir passer la demande de délai en instruction ?';
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
        id="passer-en-instruction-demande-délai"
        title="Passer la demande de délai en instruction"
        cancelButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: passerEnInstructionDemandeDélaiAction,
          id: 'passer-en-instruction-demande-délai-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">{label}</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={dateDemande} name="dateDemande" />
            </>
          ),
        }}
      />
    </>
  );
};
