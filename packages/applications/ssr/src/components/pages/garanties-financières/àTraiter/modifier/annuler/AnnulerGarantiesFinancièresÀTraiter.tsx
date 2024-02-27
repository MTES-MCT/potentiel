'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { annulerGarantiesFinancièresÀTraiter } from './annulerGarantiesFinancièresÀTraiter.action';

type AnnulerGarantiesFinancièresÀTraiterProps = {
  identifiantProjet: string;
};

export const AnnulerGarantiesFinancièresÀTraiter = ({
  identifiantProjet,
}: AnnulerGarantiesFinancièresÀTraiterProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Annuler"
      yesNo
      description="Annuler les garanties financières"
      form={{
        id: 'annuler-garanties-financieres-a-traiter-form',
        action: annulerGarantiesFinancièresÀTraiter,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.soumettre(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir annuler ces garanties financières ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};
