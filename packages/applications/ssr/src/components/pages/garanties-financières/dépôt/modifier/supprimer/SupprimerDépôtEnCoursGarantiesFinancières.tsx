'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { supprimerDépôtEnCoursGarantiesFinancièresAction } from './supprimerDépôtEnCoursGarantiesFinancières.action';

type SupprimerDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const SupprimerDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: SupprimerDépôtEnCoursGarantiesFinancièresProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Supprimer"
      priority="primary"
      description="Supprimer les garanties financières en attente de validation"
      yesNo
      form={{
        id: 'supprimer-garanties-financieres-a-traiter-form',
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
        action: supprimerDépôtEnCoursGarantiesFinancièresAction,
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir supprimer ces garanties financières ? </p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    >
      Supprimer
    </ButtonWithFormInModal>
  );
};
