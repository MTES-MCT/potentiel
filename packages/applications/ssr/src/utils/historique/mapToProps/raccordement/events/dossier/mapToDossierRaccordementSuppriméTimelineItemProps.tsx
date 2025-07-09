import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToDossierRaccordementSuppriméTimelineItemProps = (
  modification: Lauréat.Raccordement.DossierDuRaccordementSuppriméEvent & { createdAt: string },
) => {
  const { référenceDossier } = modification.payload;

  return {
    date: modification.createdAt as DateTime.RawType,
    title: (
      <div>
        Le dossier de raccordement ayant comme référence{' '}
        <span className="font-semibold">{référenceDossier}</span> a été supprimé
      </div>
    ),
  };
};
