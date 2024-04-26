'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerAbandonAction } from './annulerAbandon.action';

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
};

export const AnnulerAbandon = ({ identifiantProjet }: AnnulerAbandonFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-full text-center"
      >
        Annuler
      </Button>

      <ModalWithForm
        title="Annuler l'abandon"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={{
          action: annulerAbandonAction,
          method: 'post',
          id: 'annuler-abandon-form',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.back(),
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir annuler cet abandon ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
