'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';

import { Form } from '@/components/atoms/form/Form';

import { supprimerDépôtEnCoursGarantiesFinancièresAction } from './supprimerDépôtEnCoursGarantiesFinancières.action';

type SupprimerDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const SupprimerDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: SupprimerDépôtEnCoursGarantiesFinancièresProps) => {
  const router = useRouter();

  const [modal, _] = useState(
    createModal({
      id: `action-modal-Supprimer`,
      isOpenedByDefault: false,
    }),
  );

  return (
    <>
      <Button priority="primary" onClick={() => modal.open()}>
        <span className="mx-auto">Supprimer</span>
      </Button>

      <modal.Component
        title="Supprimer les garanties financières en attente de validation"
        buttons={[
          {
            type: 'button',
            children: 'Non',
          },
          {
            type: 'submit',
            nativeButtonProps: {
              className: 'text-theme-white bg-theme-blueFrance',
              form: 'supprimer-garanties-financieres-a-traiter-form',
            },
            children: 'Oui',
            doClosesModal: false,
          },
        ]}
      >
        <Form
          {...{
            id: 'supprimer-garanties-financieres-a-traiter-form',
            action: supprimerDépôtEnCoursGarantiesFinancièresAction,
            method: 'post',
            encType: 'multipart/form-data',
            omitMandatoryFieldsLegend: true,
            onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
            children: (
              <>
                <p className="mt-3">
                  Êtes-vous sûr de vouloir supprimer ces garanties financières ?
                </p>
                <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              </>
            ),
          }}
        />
      </modal.Component>
    </>
  );
};
