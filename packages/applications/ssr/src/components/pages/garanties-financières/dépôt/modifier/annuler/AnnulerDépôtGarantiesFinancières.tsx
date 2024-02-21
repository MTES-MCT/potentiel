'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { annulerDépôtGarantiesFinancièresAction } from './annulerDépôtGarantiesFinancières.action';

type AnnulerDépôtGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const AnnulerDépôtGarantiesFinancières = ({
  identifiantProjet,
}: AnnulerDépôtGarantiesFinancièresFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Annuler"
      yesNo
      description="Annuler la soumission de garanties financières"
      form={{
        id: 'annuler-dépôt-garanties-financieres-form',
        action: annulerDépôtGarantiesFinancièresAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.soumettre(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">
              Êtes-vous sûr de vouloir annuler cette soumission de garanties financières ?
            </p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};
