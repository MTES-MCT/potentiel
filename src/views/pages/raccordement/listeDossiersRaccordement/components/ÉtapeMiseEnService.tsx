import React, { FC } from 'react';

import routes from '@potentiel/routes';
import { CalendarIcon, EditIcon, Link } from '@potentiel/ui';
import { afficherDate } from '../../../../helpers';

import { Etape } from './Etape';
import { RawIdentifiantProjet } from '@potentiel/domain-usecases';

type ÉtapeMiseEnServiceProps = {
  identifiantProjet: RawIdentifiantProjet;
  référence: string;
  dateMiseEnService: string | undefined;
  showEditLink: boolean;
};

export const ÉtapeMiseEnService: FC<ÉtapeMiseEnServiceProps> = ({
  identifiantProjet,
  référence,
  dateMiseEnService,
  showEditLink,
}) => (
  <Etape
    className="relative"
    statut={dateMiseEnService ? 'étape validée' : 'étape à venir'}
    titre="Mise en service"
  >
    {dateMiseEnService ? (
      <div className="flex items-center text-sm">
        <div>
          <CalendarIcon className="mr-1" title="date de mise en service" />
          {afficherDate(new Date(dateMiseEnService))}
        </div>
        {showEditLink && (
          <Link
            href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(identifiantProjet, référence)}
            className="absolute top-2 right-2"
            aria-label={`Modifier la date de mise en service pour le dossier ${référence}`}
          >
            <EditIcon aria-hidden className="mr-1" />
            Modifier
          </Link>
        )}
      </div>
    ) : showEditLink ? (
      <Link
        className="mt-4 text-center"
        href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(identifiantProjet, référence)}
        aria-label={`Transmettre la date de mise en service pour le dossier ${référence}`}
      >
        Transmettre
      </Link>
    ) : (
      <p>La date de mise en service sera renseignée par la DGEC.</p>
    )}
  </Etape>
);
