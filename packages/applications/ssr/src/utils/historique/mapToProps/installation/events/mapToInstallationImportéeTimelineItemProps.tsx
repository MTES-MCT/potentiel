import { Lauréat } from '@potentiel-domain/projet';

import { DétailTypologieInstallation } from './DétailTypologieInstallation';

export const mapToInstallationImportéeTimelineItemProps = (
  record: Lauréat.Installation.InstallationImportéeEvent,
) => {
  const { importéLe, installateur, typologieInstallation } = record.payload;
  return {
    date: importéLe,
    title: <div>Candidature :</div>,
    content: (
      <>
        <div>
          <div>Typologie du projet : </div>
          <div>{DétailTypologieInstallation(typologieInstallation)}</div>
        </div>
        <div>Installateur : {installateur}</div>
      </>
    ),
  };
};
