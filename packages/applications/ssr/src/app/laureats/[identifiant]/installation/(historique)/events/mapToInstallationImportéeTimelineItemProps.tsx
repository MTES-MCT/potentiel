import { Lauréat } from '@potentiel-domain/projet';

import { DétailTypologieDuProjet } from './DétailTypologieDuProjet';

export const mapToInstallationImportéeTimelineItemProps = (
  record: Lauréat.Installation.InstallationImportéeEvent,
) => {
  const { importéeLe, installateur, typologieDuProjet } = record.payload;
  return {
    date: importéeLe,
    title: <div>Candidature :</div>,
    content: (
      <>
        <div>
          <div>Typologie du projet : </div>
          <div>{DétailTypologieDuProjet(typologieDuProjet)}</div>
        </div>
        <div>Installateur : {installateur}</div>
      </>
    ),
  };
};
