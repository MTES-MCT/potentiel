'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerDemandeDélaiAction } from './annulerDemandeDélai.action';

type AnnulerDemandeDélaiFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const AnnulerDemandeDélai = ({ identifiantProjet }: AnnulerDemandeDélaiFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        priority="secondary"
        onClick={() => setIsOpen(true)}
        className="block w-1/2 text-center"
      >
        Annuler
      </Button>

      <ModalWithForm
        id="annuler-demande-délai"
        title="Annuler la demande de délai"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerDemandeDélaiAction,
          id: 'annuler-demande-délai-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir annuler la demande de délai ?</p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
