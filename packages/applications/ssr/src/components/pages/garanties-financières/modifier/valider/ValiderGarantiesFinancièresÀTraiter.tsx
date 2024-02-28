'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { validerGarantiesFinancièresÀTraiterAction } from './validerGarantiesFinancièresÀTraiter.action';

type ValiderGarantiesFinancièresÀTraiterProps = {
  identifiantProjet: string;
};

export const ValiderGarantiesFinancièresÀTraiter = ({
  identifiantProjet,
}: ValiderGarantiesFinancièresÀTraiterProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Valider"
      yesNo
      description="Valider les garanties financières"
      form={{
        id: 'valider-garanties-financieres-a-traiter-form',
        action: validerGarantiesFinancièresÀTraiterAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir valider ces garanties financières ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};
