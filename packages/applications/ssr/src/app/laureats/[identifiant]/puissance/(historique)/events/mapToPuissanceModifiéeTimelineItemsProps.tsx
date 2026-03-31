import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToPuissanceModifiéeTimelineItemsProps = (
  event: Lauréat.Puissance.PuissanceModifiéeEvent,
  unitéPuissance: string,
): TimelineItemProps => {
  const {
    modifiéeLe,
    modifiéePar,
    puissance,
    raison,
    puissanceDeSite,
    pièceJustificative,
    identifiantProjet,
  } = event.payload;

  return {
    date: modifiéeLe,
    title: 'Puissance modifiée',
    actor: modifiéePar,
    file: pièceJustificative && {
      document: Lauréat.Puissance.DocumentPuissance.pièceJustificative({
        identifiantProjet,
        demandéLe: modifiéeLe,
        pièceJustificative,
      }),
      ariaLabel: `Télécharger le justificatif du changement de puissance enregistré le ${formatDateToText(modifiéeLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        </div>
        {puissanceDeSite !== undefined && (
          <div>
            Nouvelle puissance de site :{' '}
            <span className="font-semibold">
              {puissanceDeSite} {unitéPuissance}
            </span>
          </div>
        )}
      </div>
    ),
    reason: raison,
  };
};
