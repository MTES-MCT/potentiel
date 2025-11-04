import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementNomProjetEnregistréTimelineItemProps = (
  event: Lauréat.ChangementNomProjetEnregistréEvent,
): TimelineItemProps => {
  const { nomProjet, enregistréLe, enregistréPar } = event.payload;

  return {
    date: enregistréLe,
    title: 'Nom du projet modifié',
    acteur: enregistréPar,
    content: (
      <div>
        Nouveau nom : <span className="font-semibold">{nomProjet}</span>
      </div>
    ),
  };
};
