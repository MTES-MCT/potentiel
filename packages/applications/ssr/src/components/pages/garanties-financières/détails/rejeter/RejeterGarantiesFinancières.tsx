'use client';

import { useRouter } from 'next/navigation';

import { Routes } from '@potentiel-libraries/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';

import { rejeterGarantiesFinancièresAction } from './rejeterGarantiesFinancières.action';

type RejeterGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const RejeterGarantiesFinancières = ({
  identifiantProjet,
}: RejeterGarantiesFinancièresFormProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Rejeter"
      yesNo
      description="Rejeter les garanties financières"
      form={{
        id: 'rejeter-garanties-financieres-form',
        action: rejeterGarantiesFinancièresAction,
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
