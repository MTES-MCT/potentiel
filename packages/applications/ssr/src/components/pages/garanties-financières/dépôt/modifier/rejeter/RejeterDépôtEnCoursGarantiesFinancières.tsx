'use client';

import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

import { rejeterGarantiesFinancièresÀTraiterAction } from './rejeterDépôtEnCoursGarantiesFinancières.action';

type RejeterDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const RejeterDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: RejeterDépôtEnCoursGarantiesFinancièresProps) => {
  const router = useRouter();

  return (
    <ButtonWithFormInModal
      name="Rejeter"
      description="Rejeter les garanties financières"
      form={{
        id: 'rejeter-garanties-financieres-a-traiter-form',
        action: rejeterGarantiesFinancièresÀTraiterAction,
        method: 'post',
        encType: 'multipart/form-data',
        omitMandatoryFieldsLegend: true,
        onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
        children: (
          <>
            <p className="mt-3">Êtes-vous sûr de vouloir rejeter ces garanties financières ?</p>
            <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
          </>
        ),
        buttons: (
          <>
            <Button priority="secondary">Non</Button>
            <SubmitButton>Oui</SubmitButton>
          </>
        ),
      }}
    />
  );
};
