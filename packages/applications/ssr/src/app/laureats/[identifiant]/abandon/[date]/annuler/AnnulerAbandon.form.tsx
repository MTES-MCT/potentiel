'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Notice from '@codegouvfr/react-dsfr/Notice';
import { useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { annulerAbandonAction } from './annulerAbandon.action';

type AnnulerAbandonFormProps = {
  identifiantProjet: string;
};

export const AnnulerAbandonForm = ({ identifiantProjet }: AnnulerAbandonFormProps) => {
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
        id="annuler-abandon"
        title="Annuler l'abandon"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: annulerAbandonAction,
          id: 'annuler-abandon-form',
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">Êtes-vous sûr de vouloir annuler cet abandon ?</p>
              <Notice
                title="PPA"
                description={
                  <span>
                    Si vous aviez signalé un contrat de vente de gré à gré (PPA) lors de votre
                    demande d'abandon, ce signalement sera automatiquement annulé.
                  </span>
                }
                severity="info"
              />
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
            </>
          ),
        }}
      />
    </>
  );
};
