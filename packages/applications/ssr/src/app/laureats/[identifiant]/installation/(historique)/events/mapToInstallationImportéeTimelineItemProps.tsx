import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { DétailTypologieInstallation } from './DétailTypologieInstallation';

export const mapToInstallationImportéeTimelineItemProps = (
  event: Lauréat.Installation.InstallationImportéeEvent,
): TimelineItemProps => {
  const { importéeLe, installateur, typologieInstallation } = event.payload;
  return {
    date: importéeLe,
    title: 'Candidature :',
    details: (
      <>
        <div>
          <div>Typologie du projet : </div>
          <div>
            <DétailTypologieInstallation typologieInstallation={typologieInstallation} />
          </div>
        </div>
        <div>Installateur : {installateur}</div>
      </>
    ),
  };
};
