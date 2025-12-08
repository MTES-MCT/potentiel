'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerChangementReprésentantLégalAction } from './annulerChangementReprésentantLégal.action';

type AnnulerChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
};

export const AnnulerChangementReprésentantLégalForm = ({
  identifiantProjet,
}: AnnulerChangementReprésentantLégalFormProps) => {
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
        id="annuler-changementReprésentantLégal-modal"
        title="Annuler le changement de représentant légal"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerChangementReprésentantLégalAction,
          id: 'annuler-changementReprésentantLégal-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir annuler ce changement de représentant légal ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
