import Link from 'next/link';
import { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import { Icon } from '@/components/atoms/Icon';

import { Etape } from '../../components/Étape';

export type ÉtapeMiseEnServiceProps = {
  identifiantProjet: string;
  référence: string;
  miseEnService: PlainType<
    Lauréat.Raccordement.ConsulterDossierRaccordementReadModel['miseEnService']
  >;
  actions: { modifier: boolean; transmettre: boolean };
};

export const ÉtapeDateMiseEnService: FC<ÉtapeMiseEnServiceProps> = ({
  identifiantProjet,
  référence,
  miseEnService,
  actions,
}) => {
  const dateMiseEnService = miseEnService?.dateMiseEnService
    ? DateTime.bind(miseEnService.dateMiseEnService)
    : undefined;
  return (
    <Etape
      className="relative"
      statut={miseEnService?.dateMiseEnService ? 'étape validée' : 'étape à venir'}
      titre="Mise en service"
    >
      {dateMiseEnService ? (
        <div className="flex items-center text-sm">
          <div>
            <Icon
              id="fr-icon-calendar-line"
              size="xs"
              className="mr-1"
              title="date de mise en service"
            />
            <FormattedDate date={dateMiseEnService.formatter()} />
          </div>

          {actions.modifier && (
            <Link
              href={Routes.Raccordement.modifierDateMiseEnService(identifiantProjet, référence)}
              className="absolute top-2 right-2"
              aria-label={`Modifier la date de mise en service pour le dossier ${référence}`}
              prefetch={false}
            >
              <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
              Modifier
            </Link>
          )}
        </div>
      ) : actions.transmettre ? (
        <Link
          className="mt-4 w-fit mx-auto"
          href={Routes.Raccordement.transmettreDateMiseEnService(identifiantProjet, référence)}
          aria-label={`Transmettre la date de mise en service pour le dossier ${référence}`}
        >
          Transmettre
        </Link>
      ) : (
        <p>La date de mise en service sera renseignée par la DGEC.</p>
      )}
    </Etape>
  );
};
