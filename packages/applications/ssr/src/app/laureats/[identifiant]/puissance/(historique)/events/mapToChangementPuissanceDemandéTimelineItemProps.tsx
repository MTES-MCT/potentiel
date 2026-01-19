import { Routes } from '@potentiel-applications/routes';
import { DocumentProjet, Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementPuissanceDemandéTimelineItemProps = ({
  event,
  unitéPuissance,
}: {
  event: Lauréat.Puissance.ChangementPuissanceDemandéEvent;
  unitéPuissance: string;
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
      ariaLabel: `Télécharger le justificatif de la demande de changement de puissance en date du ${formatDateToText(demandéLe)}`,
    },
    link: {
      url: Routes.Puissance.changement.détails(identifiantProjet, demandéLe),
      label: 'Détail de la demande',
      ariaLabel: `Voir le détail de la demande de changement de puissance en date du ${formatDateToText(demandéLe)}`,
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
