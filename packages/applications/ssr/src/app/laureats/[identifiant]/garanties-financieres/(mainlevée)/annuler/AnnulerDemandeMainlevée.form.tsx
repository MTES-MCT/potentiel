'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerDemandeMainlevéeGarantiesFinancièresAction } from './annulerDemandeMainlevée.action';

type AnnulerDemanderMainlevéeProps = {
  identifiantProjet: string;
};

export const AnnulerDemandeMainlevée = ({ identifiantProjet }: AnnulerDemanderMainlevéeProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Annuler la demande de mainlevée
      </Button>

      <ModalWithForm
        id="annuler-demande-mainlevée-gf"
        title="Annuler la demande de mainlevée des garanties financières"
        rejectButtonLabel="Retour"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerDemandeMainlevéeGarantiesFinancièresAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir annuler votre demande de mainlevée de vos garanties
                financières ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
