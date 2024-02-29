'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { supprimerGarantiesFinancièresÀTraiterAction } from './supprimerGarantiesFinancièresÀTraiter.action';

type SupprimerGarantiesFinancièresÀTraiterProps = {
  identifiantProjet: string;
};

export const SupprimerGarantiesFinancièresÀTraiter = ({
  identifiantProjet,
}: SupprimerGarantiesFinancièresÀTraiterProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Supprimer"
      yesNo
      description="Supprimer les garanties financières en attente de validation"
      form={{
        id: 'supprimer-garanties-financieres-a-traiter-form',
        action: supprimerGarantiesFinancièresÀTraiterAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.soumettre(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir supprimer ces garanties financières ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};
