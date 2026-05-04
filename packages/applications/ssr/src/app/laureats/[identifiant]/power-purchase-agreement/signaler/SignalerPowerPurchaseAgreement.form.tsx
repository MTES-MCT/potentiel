'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { signalerPowerPurchaseAgreementAction } from './signalerPowerPurchaseAgreement.action';

export type SignalerPowerPurchaseAgreementFormProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
};

export const SignalerPowerPurchaseAgreementForm: FC<SignalerPowerPurchaseAgreementFormProps> = ({
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
          Signaler le PPA
        </Button>
      </div>

      <ModalWithForm
        id="signaler-ppa-modal"
        title="Signaler que le projet est parti en PPA"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: signalerPowerPurchaseAgreementAction,
          id: 'signaler-ppa-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir signaler que ce projet est parti en PPA ?
              </p>
              <input type={'hidden'} value={idProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
