import { DateTime } from '@potentiel-domain/common';
import { Historique } from '@potentiel-domain/historique';

export const mapToRacordementSuppriméTimelineItemProps = (
  modification: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => ({
  date: modification.createdAt as DateTime.RawType,
  title: <div>Le raccordement du projet a été supprimé</div>,
});
