'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { rejeterDépôtGarantiesFinancièresAction } from './rejeterDépôtGarantiesFinancières.action';

type RejeterDépôtGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const RejeterDépôtGarantiesFinancières = ({
  identifiantProjet,
}: RejeterDépôtGarantiesFinancièresFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Rejeter"
      yesNo
      description="Rejeter la soumission de garanties financières"
      form={{
        id: 'rejeter-dépôt-garanties-financieres-form',
        action: rejeterDépôtGarantiesFinancièresAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">
              Êtes-vous sûr de vouloir rejeter cette soumission de garanties financières ?
            </p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
      }}
    />
  );
};
