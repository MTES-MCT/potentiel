'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerMainLevéeGarantiesFinancièresAction } from './annulerMainLevéeGarantiesFinancières.action';

type AnnulerMainLevéeGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const AnnulerMainLevéeGarantiesFinancières = ({
  identifiantProjet,
}: AnnulerMainLevéeGarantiesFinancièresFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Annuler sa demande de main-levée des garanties financières
      </Button>

      <ModalWithForm
        title="Annuler sa demande de main-levée des garanties financières"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Retour"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerMainLevéeGarantiesFinancièresAction,
          method: 'post',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir annuler votre demande de main-levée de vos garanties
                financières ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
