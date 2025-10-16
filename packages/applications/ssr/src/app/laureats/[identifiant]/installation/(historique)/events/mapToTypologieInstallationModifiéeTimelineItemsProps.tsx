import { Lauréat } from '@potentiel-domain/projet';

import { DétailTypologieInstallation } from './DétailTypologieInstallation';

export const mapToTypologieInstallationModifiéeTimelineItemsProps = (
  record: Lauréat.Installation.TypologieInstallationModifiéeEvent,
) => {
  const { modifiéeLe, modifiéePar, typologieInstallation } = record.payload;

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
        {DétailTypologieInstallation(typologieInstallation)}
      </div>
    ),
  };
};
