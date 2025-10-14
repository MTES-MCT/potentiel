import { Lauréat } from '@potentiel-domain/projet';

import { DétailTypologieDuProjet } from './DétailTypologieDuProjet';

export const mapToTypologieDuProjetModifiéeTimelineItemsProps = (
  record: Lauréat.Installation.TypologieDuProjetModifiéeEvent,
) => {
  const { modifiéeLe, modifiéePar, typologieDuProjet } = record.payload;

  return {
    date: modifiéeLe,
    title: (
      <div>
        Typologie du projet modifiée par {<span className="font-semibold">{modifiéePar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>Nouvelle typologie du projet :</div>
        {DétailTypologieDuProjet(typologieDuProjet)}
      </div>
    ),
  };
};
