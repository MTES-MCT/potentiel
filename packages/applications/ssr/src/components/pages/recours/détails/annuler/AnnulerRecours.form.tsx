'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerRecoursAction } from './annulerRecours.action';

type AnnulerRecoursFormProps = {
  identifiantProjet: string;
};

export const AnnulerRecours = ({ identifiantProjet }: AnnulerRecoursFormProps) => {
  const router = useRouter();
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
        id="annuler-recours-modal"
        title="Annuler le recours"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerRecoursAction,
          method: 'POST',
          id: 'annuler-recours-form',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.back(),
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir annuler ce recours ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
