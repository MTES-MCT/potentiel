import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { DisplayRaisonChangement } from '@/components/atoms/historique/DisplayRaisonChangement';

import { DétailTypologieInstallation } from './DétailTypologieInstallation';

export const mapToTypologieInstallationModifiéeTimelineItemsProps = (
  event: Lauréat.Installation.TypologieInstallationModifiéeEvent,
): TimelineItemProps => {
  const {
    modifiéeLe,
    modifiéePar,
    typologieInstallation,
    raison,
    pièceJustificative,
    identifiantProjet,
  } = event.payload;

  return {
    date: modifiéeLe,
    title: 'Typologie du projet modifiée',
    acteur: modifiéePar,
    content: (
      <div className="flex flex-col gap-2">
        <div>Nouvelle typologie du projet :</div>
        <DétailTypologieInstallation typologieInstallation={typologieInstallation} />
        <DisplayRaisonChangement raison={raison} />
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Lauréat.Installation.TypeDocumentTypologieInstallation.pièceJustificative.formatter(),
                modifiéeLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
      </div>
    ),
  };
};
