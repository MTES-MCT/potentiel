'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { validerGarantiesFinancièresAction } from './validerGarantiesFinancières.action';

type ValiderGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const ValiderGarantiesFinancières = ({
  identifiantProjet,
}: ValiderGarantiesFinancièresFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Valider"
      yesNo
      description="Valider les garanties financières"
      form={{
        id: 'valider-garanties-financieres-form',
        action: validerGarantiesFinancièresAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">
              Êtes-vous sûr de vouloir valider cette soumission de garanties financières ?
            </p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};
