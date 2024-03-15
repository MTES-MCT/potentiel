'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { validerDépôtEnCoursGarantiesFinancièresAction } from './validerDépôtEnCoursGarantiesFinancières.action';

type ValiderDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const ValiderDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: ValiderDépôtEnCoursGarantiesFinancièresProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Valider"
      yesNo
      description="Valider les garanties financières"
      form={{
        id: 'valider-garanties-financieres-a-traiter-form',
        action: validerDépôtEnCoursGarantiesFinancièresAction,
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
