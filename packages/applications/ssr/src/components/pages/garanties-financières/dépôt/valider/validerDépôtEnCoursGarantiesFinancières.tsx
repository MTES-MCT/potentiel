'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { validerDépôtEnCoursGarantiesFinancièresAction } from './validerDépôtEnCoursGarantiesFinancières.action';

type ValiderDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const ValiderDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: ValiderDépôtEnCoursGarantiesFinancièresProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)}>
        Valider
      </Button>

      <ModalWithForm
        id="valider-gf"
        title="Valider les garanties financières"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'valider-garanties-financieres-a-traiter-form',
          action: validerDépôtEnCoursGarantiesFinancièresAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir valider ces garanties financières ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
