import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToRacordementSuppriméTimelineItemProps = (
  modification: Lauréat.ListerHistoriqueProjetReadModel['items'][number],
) => ({
  date: modification.createdAt as DateTime.RawType,
  title: <div>Le raccordement du projet a été supprimé</div>,
});
