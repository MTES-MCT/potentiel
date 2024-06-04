'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { demanderMainLevéeGarantiesFinancièresAction } from './demanderMainLevéeGarantiesFinancières.action';

type DemanderMainLevéeGarantiesFinancièresFormProps = {
  identifiantProjet: string;
  motif: string;
};

export const DemanderMainLevéeGarantiesFinancières = ({
  identifiantProjet,
  motif,
}: DemanderMainLevéeGarantiesFinancièresFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Demander la main-levée des garanties financières
      </Button>

      <ModalWithForm
        title="Demander la main-levée des garanties financières"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: demanderMainLevéeGarantiesFinancièresAction,
          method: 'post',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir demander la main-levée de vos garanties financières ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={motif} name="motif" />
            </>
          ),
        }}
      />
    </>
  );
};
