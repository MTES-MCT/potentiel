import React, { FC } from 'react';

import routes from '@routes';
import { CalendarIcon, EditIcon, Link } from '@components';
import { afficherDate } from '@views/helpers';

import { Etape } from './Etape';

type ÉtapeMiseEnServiceProps = {
  identifiantProjet: string;
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
      <div className="flex items-center">
        <div>
          <CalendarIcon className="mr-1" title="date de mise en service" />
          {afficherDate(new Date(dateMiseEnService))}
        </div>
        {showEditLink && (
          <Link
            href={routes.GET_TRANSMETTRE_DATE_MISE_EN_SERVICE_PAGE(identifiantProjet, référence)}
            className="absolute top-2 right-2 text-sm"
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
      >
        Transmettre
      </Link>
    ) : (
      <p>La date de mise en service sera renseignée par la DGEC.</p>
    )}
  </Etape>
);
