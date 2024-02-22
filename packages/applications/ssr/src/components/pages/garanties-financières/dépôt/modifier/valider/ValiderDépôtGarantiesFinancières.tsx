'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { validerDépôtGarantiesFinancièresAction } from './validerDépôtGarantiesFinancières.action';

type ValiderDépôtGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const ValiderDépôtGarantiesFinancières = ({
  identifiantProjet,
}: ValiderDépôtGarantiesFinancièresFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Valider"
      yesNo
      description="Valider le dépôt"
      form={{
        id: 'valider-dépôt-garanties-financieres-form',
        action: validerDépôtGarantiesFinancièresAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir valider ce dépôt ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};
