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
        Typologie installation modifiée par {<span className="font-semibold">{modifiéePar}</span>}
      </div>
    ),
    content: (
      <div className="flex flex-col gap-2">
        <div>Nouvel typologie du projet :</div>
        {DétailTypologieInstallation(typologieInstallation)}
      </div>
    ),
  };
};
