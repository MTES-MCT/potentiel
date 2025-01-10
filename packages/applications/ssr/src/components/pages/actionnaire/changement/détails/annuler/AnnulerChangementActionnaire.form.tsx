'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerChangementActionnaireAction } from './annulerChangementActionnaire.action';

type AnnulerChangementActionnaireFormProps = {
  identifiantProjet: string;
};

export const AnnulerChangementActionnaire = ({
  identifiantProjet,
}: AnnulerChangementActionnaireFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)} className="block text-center">
        Annuler la demande de modification de l’actionnariat
      </Button>

      <ModalWithForm
        id="annuler-changement-actionnaire-modal"
        title="Annuler la demande de modification de l’actionnariat"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerChangementActionnaireAction,
          id: 'annuler-changement-actionnaire-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir annuler cette modification de l’actionnariat ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
