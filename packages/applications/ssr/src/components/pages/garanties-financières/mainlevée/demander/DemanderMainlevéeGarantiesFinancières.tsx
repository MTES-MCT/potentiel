'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { demanderMainlevéeGarantiesFinancièresAction } from './demanderMainlevéeGarantiesFinancières.action';

type DemanderMainlevéeGarantiesFinancièresFormProps = {
  identifiantProjet: string;
  motif: string;
};

export const DemanderMainlevéeGarantiesFinancières = ({
  identifiantProjet,
  motif,
}: DemanderMainlevéeGarantiesFinancièresFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Demander la mainlevée des garanties financières
      </Button>

      <ModalWithForm
        title="Demander la mainlevée des garanties financières"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: demanderMainlevéeGarantiesFinancièresAction,
          method: 'POST',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir demander la mainlevée de vos garanties financières ?
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
