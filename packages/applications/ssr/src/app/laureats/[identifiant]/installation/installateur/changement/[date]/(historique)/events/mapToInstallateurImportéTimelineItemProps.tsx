import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToInstallateurImportéTimelineItemProps = (
  event: Lauréat.Installation.InstallationImportéeEvent,
): TimelineItemProps => {
  const { importéeLe, installateur } = event.payload;
  return {
    date: importéeLe,
    title: 'Candidature :',
    content: <div>Installateur : {installateur}</div>,
  };
};
