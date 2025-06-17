import { Raccordement } from '@potentiel-domain/laureat';

import { MapToRaccordementTimelineItemProps } from '../../../mapToRaccordementTimelineItemProps';

export const mapToDossierRacordementSuppriméTimelineItemProps: MapToRaccordementTimelineItemProps =
  (modification, icon) => {
    const { suppriméeLe, suppriméePar, référenceDossierRaccordement } =
      modification.payload as Raccordement.DateMiseEnServiceSuppriméeEvent['payload'];

    return {
      date: suppriméeLe,
      icon,
      title: (
        <div>
          La date de mise en service du dossier de raccordement ayant comme référence
          <span className="font-semibold">{référenceDossierRaccordement}</span>a été supprimée par{' '}
          <span className="font-semiboold">{suppriméePar}</span>.
        </div>
      ),
    };
  };
