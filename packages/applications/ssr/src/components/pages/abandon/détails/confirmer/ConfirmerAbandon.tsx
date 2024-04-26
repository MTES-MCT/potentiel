'use client';

import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { confirmerAbandonAction } from './confirmerAbandon.action';

type ConfirmerAbandonFormProps = {
  identifiantProjet: string;
};

export const ConfirmerAbandon = ({ identifiantProjet }: ConfirmerAbandonFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-full text-center"
      >
        Confirmer
      </Button>

      <ModalWithForm
        title="Confirmer l'abandon"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={{
          action: confirmerAbandonAction,
          method: 'post',
          id: 'confirmer-abandon-form',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.refresh(),
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
