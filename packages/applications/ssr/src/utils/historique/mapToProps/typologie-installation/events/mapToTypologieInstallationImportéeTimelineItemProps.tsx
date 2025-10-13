import { Lauréat } from '@potentiel-domain/projet';

import { DétailTypologieInstallation } from './DétailTypologieInstallation';

export const mapToTypologieInstallationImportéeTimelineItemProps = (
  record: Lauréat.Installation.InstallationImportéeEvent,
) => {
  const { importéLe, typologieInstallation } = record.payload;
  return {
    date: importéLe,
    title: <div>Candidature :</div>,
    content: <>{DétailTypologieInstallation(typologieInstallation)}</>,
  };
};
