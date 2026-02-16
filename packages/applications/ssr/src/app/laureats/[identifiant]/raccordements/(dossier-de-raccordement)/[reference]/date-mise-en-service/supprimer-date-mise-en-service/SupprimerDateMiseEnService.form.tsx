'use client';

import { useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import { formatDateToText } from '@/app/_helpers';
import { Icon } from '@/components/atoms/Icon';

import { supprimerDateMiseEnServiceAction } from './supprimerDateMiseEnService.action';

type SupprimerDateMiseEnServiceProps = {
  identifiantProjet: string;
  référenceDossier: Lauréat.Raccordement.RéférenceDossierRaccordement.RawType;
  dateMiseEnService: DateTime.RawType;
};

export const SupprimerDateMiseEnService = ({
  identifiantProjet,
  référenceDossier,
  dateMiseEnService,
}: SupprimerDateMiseEnServiceProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        priority="primary"
        onClick={() => setIsOpen(true)}
        aria-label={`Supprimer la date de mise en service pour le dossier ${référenceDossier}`}
        className="mb-8"
      >
        <Icon id="fr-icon-delete-bin-line" size="xs" className="mr-1" />
        Supprimer la date de mise en service
      </Button>

      <ModalWithForm
        id="supprimer-date-mes"
        title="Supprimer la date de mise en service"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          action: supprimerDateMiseEnServiceAction,

          children: (
            <>
              <p className="mt-3">
                Êtes-vous sûr de vouloir supprimer la date de mise en service actuelle{' '}
                <span className="font-semibold">{formatDateToText(dateMiseEnService)}</span> du
                dossier de raccordement <span className="font-semibold">{référenceDossier}</span> ?
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
