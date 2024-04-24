'use client';

import { useRouter } from 'next/navigation';
import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';
import { createModal } from '@codegouvfr/react-dsfr/Modal';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';

import { validerDépôtEnCoursGarantiesFinancièresAction } from './validerDépôtEnCoursGarantiesFinancières.action';

type ValiderDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const ValiderDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: ValiderDépôtEnCoursGarantiesFinancièresProps) => {
  const router = useRouter();

  const [modal, _] = useState(
    createModal({
      id: `action-modal-Valider`,
      isOpenedByDefault: false,
    }),
  );

  return (
    <>
      <Button priority="primary" onClick={() => modal.open()}>
        <span className="mx-auto">Valider</span>
      </Button>

      <modal.Component
        title="Valider les garanties financières"
        buttons={[
          {
            type: 'button',
            children: 'Non',
          },
          {
            type: 'submit',
            nativeButtonProps: {
              className: 'text-theme-white bg-theme-blueFrance',
              form: 'valider-garanties-financieres-a-traiter-form',
            },
            children: 'Oui',
            doClosesModal: false,
          },
        ]}
      >
        <Form
          {...{
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
      </modal.Component>
    </>
  );
};
