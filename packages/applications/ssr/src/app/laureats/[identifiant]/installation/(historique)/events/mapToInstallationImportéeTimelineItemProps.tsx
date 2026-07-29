import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import { DétailsDispositifDeStockage } from '../../dispositif-de-stockage/DétailsDispositifDeStockage';
import { DétailTypologieInstallation } from './DétailTypologieInstallation';

export const mapToInstallationImportéeTimelineItemProps = (
  event: Lauréat.Installation.InstallationImportéeEvent,
): TimelineItemProps => {
  const { importéeLe, installateur, typologieInstallation, dispositifDeStockage } = event.payload;
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
        <div>
          <div>Dispositif de stockage : </div>
          {dispositifDeStockage ? (
            <div>
              <DétailsDispositifDeStockage dispositifDeStockage={dispositifDeStockage} />
            </div>
          ) : (
            <span>Non renseigné</span>
          )}
        </div>
      </>
    ),
  };
};
