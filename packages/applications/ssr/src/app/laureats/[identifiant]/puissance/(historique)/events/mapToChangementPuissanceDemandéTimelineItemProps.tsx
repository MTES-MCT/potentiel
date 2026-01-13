import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

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
    actor: demandéPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
        demandéLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif joint à la demande de changement de puissance déposée le ${demandéLe}`,
    },
    redirect: isHistoriqueProjet && {
      url: Routes.Puissance.changement.détails(identifiantProjet, demandéLe),
      label: 'Détail de la demande',
      ariaLabel: `Voir le détail de la demande de changement de puissance déposée le ${FormattedDate({ date: demandéLe })}`,
    },
    details: (
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
      </div>
    ),
  };
};
