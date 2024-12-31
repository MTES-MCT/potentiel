'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { rejeterChangementReprésentantLégalAction } from './rejeterChangementReprésentantLégal.action';

type RejeterChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
};

export const RejeterChangementReprésentantLégal = ({
  identifiantProjet,
}: RejeterChangementReprésentantLégalFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Rejeter
      </Button>

      <ModalWithForm
        id="rejeter-changementReprésentantLégal-modal"
        title="Rejeter le changement de représentant légal"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: rejeterChangementReprésentantLégalAction,
          id: 'rejeter-changementReprésentantLégal-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir rejeter ce changement de représentant légal ?
              </p>

              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
