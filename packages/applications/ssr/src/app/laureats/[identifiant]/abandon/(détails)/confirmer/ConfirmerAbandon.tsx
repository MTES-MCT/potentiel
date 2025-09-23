'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { confirmerAbandonAction } from './confirmerAbandon.action';

type ConfirmerAbandonFormProps = {
  identifiantProjet: string;
};

export const ConfirmerAbandon = ({ identifiantProjet }: ConfirmerAbandonFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Confirmer
      </Button>

      <ModalWithForm
        id="confirmer-abandon"
        title="Confirmer l'abandon"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: confirmerAbandonAction,
          id: 'confirmer-abandon-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir confirmer cet abandon ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
