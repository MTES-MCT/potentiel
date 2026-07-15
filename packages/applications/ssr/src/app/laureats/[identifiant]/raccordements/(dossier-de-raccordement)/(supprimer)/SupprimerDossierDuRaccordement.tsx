'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { type FC, useState } from 'react';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { supprimerDossierDuRaccordementAction } from './supprimerDossierDuRaccordement.action';

export type SupprimerDossierDuRaccordementProps = {
  identifiantProjet: string;
  référenceDossier: string;
};

export const SupprimerDossierDuRaccordement: FC<SupprimerDossierDuRaccordementProps> = ({
  identifiantProjet,
  référenceDossier,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const safeId = encodeURIComponent(référenceDossier);

  return (
    <>
      <Button priority="tertiary" onClick={() => setIsOpen(true)} className="mt-4">
        Supprimer le dossier
      </Button>

      <ModalWithForm
        id={`supprimer-dossier-raccordement-${safeId}`}
        title={`Supprimer le dossier ${référenceDossier} du raccordement`}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: supprimerDossierDuRaccordementAction,
          id: `supprimer-dossier-${référenceDossier}-form`,
          omitMandatoryFieldsLegend: true,
          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir supprimer le dossier {référenceDossier} du raccordement ?
              </p>
              <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
              <input type={'hidden'} value={référenceDossier} name="referenceDossier" />
            </>
          ),
        }}
      />
    </>
  );
};
