'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { supprimerDépôtEnCoursGarantiesFinancièresAction } from './supprimerDépôtEnCoursGarantiesFinancières.action';

type SupprimerDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const SupprimerDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: SupprimerDépôtEnCoursGarantiesFinancièresProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)}>
        Supprimer
      </Button>

      <ModalWithForm
        title="Supprimer les garanties financières en attente de validation"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'supprimer-garanties-financieres-a-traiter-form',
          method: 'POST',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          action: supprimerDépôtEnCoursGarantiesFinancièresAction,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir supprimer ces garanties financières ?{' '}
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
