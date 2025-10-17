import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToNomProjetModifiéTimelineItemProps = (
  event: Lauréat.NomProjetModifiéEvent,
): TimelineItemProps => {
  const { nomProjet, modifiéLe, modifiéPar } = event.payload;

  return {
    date: modifiéLe,
    title: 'Nom du projet modifié',
    acteur: modifiéPar,
    content: (
      <div>
        Nouveau nom : <span className="font-semibold">{nomProjet}</span>
      </div>
    ),
  };
};
