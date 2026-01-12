import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';

import { DownloadDocument } from '@/components/atoms/form/document/DownloadDocument';
import { TimelineItemProps } from '@/components/organisms/timeline';
import { FormattedDate } from '@/components/atoms/FormattedDate';

export const mapToChangementPuissanceDemandéTimelineItemProps = ({
  event,
  unitéPuissance,
  isHistoriqueProjet,
}: {
  event: Lauréat.Puissance.ChangementPuissanceDemandéEvent;
  unitéPuissance: string;
  isHistoriqueProjet?: true;
}): TimelineItemProps => {
  const {
    identifiantProjet,
    demandéLe,
    demandéPar,
    pièceJustificative,
    puissance,
    puissanceDeSite,
  } = event.payload;

  return {
    date: demandéLe,
    title: 'Changement de puissance demandé',
    acteur: demandéPar,
    content: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        </div>
        {puissanceDeSite !== undefined ? (
          <div>
            Nouvelle puissance de site :{' '}
            <span className="font-semibold">
              {puissanceDeSite} {unitéPuissance}
            </span>
          </div>
        ) : null}
        {pièceJustificative && (
          <DownloadDocument
            className="mb-0"
            label="Télécharger la pièce justificative"
            format="pdf"
            url={Routes.Document.télécharger(
              DocumentProjet.convertirEnValueType(
                identifiantProjet,
                Lauréat.Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
                demandéLe,
                pièceJustificative.format,
              ).formatter(),
            )}
          />
        )}
        {isHistoriqueProjet && (
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Puissance.changement.détails(identifiantProjet, demandéLe),
            }}
            aria-label={`Voir le détail de la demande de changement de puissance déposée le ${FormattedDate({ date: demandéLe })}`}
          >
            Détail de la demande
          </Button>
        )}
      </div>
    ),
  };
};
