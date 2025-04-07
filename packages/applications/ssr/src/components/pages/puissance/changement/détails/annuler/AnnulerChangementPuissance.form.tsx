'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerChangementPuissanceAction } from './annulerChangementPuissance.action';

type AnnulerChangementPuissanceFormProps = {
  identifiantProjet: string;
};

export const AnnulerChangementPuissance = ({
  identifiantProjet,
}: AnnulerChangementPuissanceFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="block text-center">
        Annuler
      </Button>

      <ModalWithForm
        id="annuler-changement-puissance-modal"
        title="Annuler"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerChangementPuissanceAction,
          id: 'annuler-changement-puissance-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir annuler ce changement de puissance ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
