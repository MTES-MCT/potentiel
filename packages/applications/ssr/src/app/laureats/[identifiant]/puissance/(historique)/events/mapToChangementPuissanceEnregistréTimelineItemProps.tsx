import { DocumentProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementPuissanceEnregistréTimelineItemProps = (
  event: Lauréat.Puissance.ChangementPuissanceEnregistréEvent,
  unitéPuissance: string,
): TimelineItemProps => {
  const {
    enregistréLe,
    enregistréPar,
    identifiantProjet,
    pièceJustificative,
    puissance,
    puissanceDeSite,
    raison,
  } = event.payload;
  return {
    date: enregistréLe,
    title: 'Puissance modifiée',
    actor: enregistréPar,
    file: pièceJustificative && {
      document: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        Lauréat.Puissance.TypeDocumentPuissance.pièceJustificative.formatter(),
        enregistréLe,
        pièceJustificative.format,
      ),
      ariaLabel: `Télécharger le justificatif du changement de puissance en date du ${formatDateToText(enregistréLe)}`,
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
    reason: raison,
    link: {
      url: Routes.Puissance.changement.détails(identifiantProjet, enregistréLe),
      label: 'Détail du changement',
      ariaLabel: `Voir le détail du changement de puissance enregistré le ${formatDateToText(enregistréLe)}`,
    },
  };
};
