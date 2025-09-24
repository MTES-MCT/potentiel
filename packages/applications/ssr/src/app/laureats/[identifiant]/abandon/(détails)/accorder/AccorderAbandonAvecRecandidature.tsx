'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { accorderAbandonAvecRecandidatureAction } from './accorderAbandonAvecRecandidature.action';

type AccorderAbandonAvecRecandidatureFormProps = {
  identifiantProjet: string;
};

export const AccorderAbandonAvecRecandidature = ({
  identifiantProjet,
}: AccorderAbandonAvecRecandidatureFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Accorder
      </Button>

      <ModalWithForm
        id="accorder-abandon-avec-recandidature"
        title="Accorder l'abandon"
        cancelButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'accorder-abandon-avec-recandidature-form',
          action: accorderAbandonAvecRecandidatureAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir accorder cet abandon ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
