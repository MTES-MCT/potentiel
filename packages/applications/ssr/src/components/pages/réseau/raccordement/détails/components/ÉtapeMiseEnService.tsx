import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Icon } from '@/components/atoms/Icon';
import { displayDate } from '@/utils/displayDate';

import { Etape } from './Étape';

type ÉtapeMiseEnServiceProps = {
  identifiantProjet: string;
  référence: string;
  dateMiseEnService?: string;
  canEdit: boolean;
};

export const ÉtapeMiseEnService: FC<ÉtapeMiseEnServiceProps> = ({
  identifiantProjet,
  référence,
  dateMiseEnService,
  canEdit,
}) => (
  <Etape
    className="relative"
    statut={dateMiseEnService ? 'étape validée' : 'étape à venir'}
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
          {displayDate(new Date(dateMiseEnService))}
        </div>

        {canEdit && (
          <Link
            href={Routes.Raccordement.transmettreDateMiseEnService(identifiantProjet, référence)}
            className="absolute top-2 right-2"
            aria-label={`Modifier la date de mise en service pour le dossier ${référence}`}
          >
            <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
            Modifier
          </Link>
        )}
      </div>
    ) : canEdit ? (
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
