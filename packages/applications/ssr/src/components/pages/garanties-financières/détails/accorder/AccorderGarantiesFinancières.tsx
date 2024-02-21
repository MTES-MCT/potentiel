'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { accorderGarantiesFinancièresAction } from './accorderGarantiesFinancières.action';

type AccorderGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const AccorderGarantiesFinancières = ({
  identifiantProjet,
}: AccorderGarantiesFinancièresFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Accorder"
      yesNo
      description="Accorder les garanties financières"
      form={{
        id: 'accorder-garanties-financieres-form',
        action: accorderGarantiesFinancièresAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">
              Êtes-vous sûr de vouloir accorder cette soumission de garanties financières ?
            </p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};
