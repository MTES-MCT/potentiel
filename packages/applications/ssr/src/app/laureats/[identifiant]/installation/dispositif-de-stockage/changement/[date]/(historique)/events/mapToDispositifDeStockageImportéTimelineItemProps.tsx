import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

import { DétailsDispositifDeStockage } from '../../../../DétailsDispositifDeStockage';

export const mapToDispositifDeStockageImportéTimelineItemProps = (
  event: Lauréat.Installation.InstallationImportéeEvent,
): TimelineItemProps => {
  const { importéeLe, dispositifDeStockage } = event.payload;
  return {
    date: importéeLe,
    title: 'Candidature :',
    details: (
      <>
        {dispositifDeStockage ? (
          <DétailsDispositifDeStockage dispositifDeStockage={dispositifDeStockage} />
        ) : (
          <div>Dispositif de stockage non renseigné</div>
        )}
      </>
    ),
  };
};
