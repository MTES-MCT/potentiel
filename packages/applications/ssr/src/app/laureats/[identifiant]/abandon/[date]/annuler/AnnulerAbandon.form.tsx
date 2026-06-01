'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { AlerteAnnulationPPA } from '../AlerteAnnulationPPA';
import { annulerAbandonAction } from './annulerAbandon.action';

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
  ppaSignaléLorsDeLaDemande: boolean;
};

export const AnnulerAbandonForm = ({
  identifiantProjet,
  ppaSignaléLorsDeLaDemande,
}: AnnulerAbandonFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Annuler
      </Button>

      <ModalWithForm
        id="annuler-abandon"
        title="Annuler l'abandon"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerAbandonAction,
          id: 'annuler-abandon-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir annuler cet abandon ?</p>
              {ppaSignaléLorsDeLaDemande && <AlerteAnnulationPPA />}
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
