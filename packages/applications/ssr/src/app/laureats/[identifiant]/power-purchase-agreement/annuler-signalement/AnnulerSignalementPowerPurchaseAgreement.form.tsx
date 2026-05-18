'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { type FC, useState } from 'react';

import { Routes } from '@potentiel-applications/routes';
import type { PlainType } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { annulerSignalementPowerPurchaseAgreementAction } from './annulerSignalementPowerPurchaseAgreement.action';

export type AnnulerSignalementPowerPurchaseAgreementFormProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
};

export const AnnulerSignalementPowerPurchaseAgreementForm: FC<
  AnnulerSignalementPowerPurchaseAgreementFormProps
> = ({ identifiantProjet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();
  return (
    <>
      <div className="mt-4 flex flex-row gap-4">
        <Button
          linkProps={{ href: Routes.Lauréat.détails.tableauDeBord(idProjet) }}
          priority="secondary"
          iconId="fr-icon-arrow-left-line"
        >
          Retour
        </Button>
        <Button priority="primary" onClick={() => setIsOpen(true)} className="block text-center">
          Confirmer
        </Button>
      </div>

      <ModalWithForm
        id="annuler-ppa-modal"
        title="Annuler le signalement d'un PPA pour ce projet"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerSignalementPowerPurchaseAgreementAction,
          id: 'annuler-ppa-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir annuler le signalement d'un PPA pour ce projet ?
              </p>
              <input type={'hidden'} value={idProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
