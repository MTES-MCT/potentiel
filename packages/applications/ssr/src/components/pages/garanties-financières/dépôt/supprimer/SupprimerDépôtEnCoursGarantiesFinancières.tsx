'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { supprimerDépôtEnCoursGarantiesFinancièresAction } from './supprimerDépôtEnCoursGarantiesFinancières.action';

type SupprimerDépôtEnCoursGarantiesFinancièresProps = {
  identifiantProjet: string;
};

export const SupprimerDépôtEnCoursGarantiesFinancières = ({
  identifiantProjet,
}: SupprimerDépôtEnCoursGarantiesFinancièresProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="secondary" onClick={() => setIsOpen(true)}>
        Supprimer
      </Button>

      <ModalWithForm
        id="supprimer-gf-en-attente"
        title="Supprimer les garanties financières en attente de validation"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Non"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          id: 'supprimer-garanties-financieres-a-traiter-form',
          method: 'POST',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          action: supprimerDépôtEnCoursGarantiesFinancièresAction,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir supprimer ces garanties financières ?{' '}
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
