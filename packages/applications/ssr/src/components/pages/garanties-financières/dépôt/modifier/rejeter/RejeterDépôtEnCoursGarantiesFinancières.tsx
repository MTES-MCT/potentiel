'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { rejeterGarantiesFinancièresÀTraiterAction } from './rejeterDépôtEnCoursGarantiesFinancières.action';

type RejeterDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const RejeterDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: RejeterDépôtEnCoursGarantiesFinancièresProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-full text-center"
      >
        Rejeter
      </Button>

      <ModalWithForm
        title="Rejeter les garanties financières"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={{
          id: 'rejeter-garanties-financieres-a-traiter-form',
          action: rejeterGarantiesFinancièresÀTraiterAction,
          method: 'post',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir rejeter ces garanties financières ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
