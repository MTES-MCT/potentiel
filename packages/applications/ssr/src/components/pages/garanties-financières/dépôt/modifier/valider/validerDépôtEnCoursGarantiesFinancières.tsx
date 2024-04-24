'use client';

import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { ButtonWithFormInModal } from '@/components/molecules/ButtonWithFormInModal';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';

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
