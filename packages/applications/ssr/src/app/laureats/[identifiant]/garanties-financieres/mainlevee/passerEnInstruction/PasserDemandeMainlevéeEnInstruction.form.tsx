'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { getStatutMainlevéeLabel } from '../../_helpers/statutMainlevéeLabels';

import { passerDemandeMainlevéeEnInstructionAction } from './passerDemandeMainlevéeEnInstruction.action';

type PasserDemandeMainlevéeEnInstructionProps = {
  identifiantProjet: string;
};

export const PasserDemandeMainlevéeEnInstruction = ({
  identifiantProjet,
}: PasserDemandeMainlevéeEnInstructionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Démarrer l'instruction
      </Button>

      <ModalWithForm
        id="démarrer-instruction-demande-mainlevée"
        title="Démarrer l'instruction de la demande de mainlevée"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: passerDemandeMainlevéeEnInstructionAction,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir démarrer l'instruction de la demande de mainlevée ?
              </p>
              <span className="italic">
                Cela passera son statut en "{getStatutMainlevéeLabel('en-instruction')}" ?
              </span>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
