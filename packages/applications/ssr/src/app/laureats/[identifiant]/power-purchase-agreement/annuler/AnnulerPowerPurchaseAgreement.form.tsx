'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { annulerPowerPurchaseAgreementAction } from './annulerPowerPurchaseAgreement.action';

export type AnnulerPowerPurchaseAgreementFormProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
};

export const AnnulerPowerPurchaseAgreementForm: FC<AnnulerPowerPurchaseAgreementFormProps> = ({
  identifiantProjet,
}) => {
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
          Annuler le PPA
        </Button>
      </div>

      <ModalWithForm
        id="annuler-ppa-modal"
        title="Annuler que le projet est parti en PPA"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerPowerPurchaseAgreementAction,
          id: 'annuler-ppa-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir annuler le PPA pour ce projet ?</p>
              <input type={'hidden'} value={idProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
