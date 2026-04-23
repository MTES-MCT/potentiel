'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Notice from '@codegouvfr/react-dsfr/Notice';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { signalerPPAAction } from './signalerPPA.action';

export type SignalerPPAFormProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
};

export const SignalerPPAForm: FC<SignalerPPAFormProps> = ({ identifiantProjet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const idProjet = IdentifiantProjet.bind(identifiantProjet).formatter();
  return (
    <>
      <Notice
        description="Vous pouvez signaler le projet comme étant signataire d'un contrat de vente de gré à gré (PPA)."
        title=""
        severity="info"
        className="print:hidden"
      />
      <div className="mt-4 flex flex-row gap-4">
        <Button
          linkProps={{ href: Routes.Lauréat.détails.tableauDeBord(idProjet) }}
          priority="secondary"
          iconId="fr-icon-arrow-left-line"
        >
          Retour
        </Button>
        <Button
          priority="primary"
          onClick={() => setIsOpen(true)}
          className="block w-1/2 text-center"
        >
          Signaler le projet en état de PPA
        </Button>
      </div>

      <ModalWithForm
        id="signaler-ppa-modal"
        title="Signaler le projet en état de PPA"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: signalerPPAAction,
          id: 'signaler-ppa-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir signaler ce projet en état de PPA ?</p>
              <input type={'hidden'} value={idProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
