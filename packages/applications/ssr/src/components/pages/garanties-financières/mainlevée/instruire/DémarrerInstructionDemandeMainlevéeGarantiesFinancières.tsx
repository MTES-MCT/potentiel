'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { convertStatutMainlevéeForView } from '../convertForView';

import { démarrerInstructionDemandeMainlevéeGarantiesFinancièresAction } from './démarrerInstructionDemandeMainlevéeGarantiesFinancières.action';

type DémarrerInstructionDemandeMainlevéeGarantiesFinancièresFormProps = {
  identifiantProjet: string;
};

export const DémarrerInstructionDemandeMainlevéeGarantiesFinancières = ({
  identifiantProjet,
}: DémarrerInstructionDemandeMainlevéeGarantiesFinancièresFormProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button priority="primary" onClick={() => setIsOpen(true)}>
        Démarrer l'instruction
      </Button>

      <ModalWithForm
        id="démarrer-instruction-demande-mainlevée"
        title="Démarrer l'instruction de la demande de mainlevée"
        acceptButtonLabel="Oui"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: démarrerInstructionDemandeMainlevéeGarantiesFinancièresAction,
          method: 'POST',
          encType: 'multipart/form-data',
          omitMandatoryFieldsLegend: true,
          onSuccess: () => router.push(Routes.GarantiesFinancières.détail(identifiantProjet)),
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir démarrer l'instruction de la demande de mainlevée ?
              </p>
              <span className="italic">
                Cela passera son statut en "
                {convertStatutMainlevéeForView(
                  GarantiesFinancières.StatutMainlevéeGarantiesFinancières.enInstruction.statut,
                )}
                " ?
              </span>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
