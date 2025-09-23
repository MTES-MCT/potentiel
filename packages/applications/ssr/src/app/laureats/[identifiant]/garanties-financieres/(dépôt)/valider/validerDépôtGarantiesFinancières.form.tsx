'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { validerDépôtGarantiesFinancièresAction } from './validerDépôtGarantiesFinancières.action';

type ValiderDépôtGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const ValiderDépôtGarantiesFinancièresForm = ({
  identifiantProjet,
}: ValiderDépôtGarantiesFinancièresFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)}>
        Valider
      </Button>

      <ModalWithForm
        id="valider-gf"
        title="Valider les garanties financières"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'valider-garanties-financieres-a-traiter-form',
          action: validerDépôtGarantiesFinancièresAction,
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
