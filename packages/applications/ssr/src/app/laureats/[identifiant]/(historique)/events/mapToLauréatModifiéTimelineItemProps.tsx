import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToNomProjetModifiéTimelineItemProps = (
  modification: Lauréat.NomProjetModifiéEvent,
) => {
  const { nomProjet, modifiéLe, modifiéPar } = modification.payload;

  return {
    date: modifiéLe,
    title: (
      <div>
        Nom du projet modifié <TimelineItemUserEmail email={modifiéPar} />
      </div>
    ),
    content: (
      <div>
        Nouveau nom : <span className="font-semibold">{nomProjet}</span>
      </div>
    ),
  };
};
