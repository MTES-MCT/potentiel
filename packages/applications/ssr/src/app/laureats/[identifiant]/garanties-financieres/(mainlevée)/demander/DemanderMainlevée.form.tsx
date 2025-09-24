'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { demanderMainlevéeAction } from './demanderMainlevée.action';

type DemanderMainlevéeFormProps = {
  identifiantProjet: string;
  motif: string;
};

export const DemanderMainlevéeForm = ({ identifiantProjet, motif }: DemanderMainlevéeFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Demander la mainlevée des garanties financières
      </Button>

      <ModalWithForm
        id="demander-mainlevée-gf"
        title="Demander la mainlevée des garanties financières"
        cancelButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: demanderMainlevéeAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir demander la mainlevée de vos garanties financières ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={motif} name="motif" />
            </>
          ),
        }}
      />
    </>
  );
};
