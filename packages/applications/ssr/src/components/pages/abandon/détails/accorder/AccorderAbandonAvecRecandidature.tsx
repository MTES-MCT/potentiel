'use client';

import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { accorderAbandonAvecRecandidatureAction } from './accorderAbandonAvecRecandidature.action';

type AccorderAbandonAvecRecandidatureFormProps = {
  identifiantProjet: string;
};

export const AccorderAbandonAvecRecandidature = ({
  identifiantProjet,
}: AccorderAbandonAvecRecandidatureFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-full text-center"
      >
        Accorder
      </Button>

      <ModalWithForm
        title="Accorder l'abandon"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={{
          id: 'accorder-abandon-avec-recandidature-form',
          action: accorderAbandonAvecRecandidatureAction,
          method: 'post',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.Abandon.détail(identifiantProjet)),
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
