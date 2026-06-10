import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import { FormattedSIRET } from '@/components/atoms/FormattedNuméroIdentification';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToProducteurModifiéTimelineItemsProps = (
  event: Lauréat.Producteur.ProducteurModifiéEvent,
): TimelineItemProps => {
  const {
    modifiéLe,
    modifiéPar,
    producteur,
    pièceJustificative,
    raison,
    identifiantProjet,
    numéroIdentification,
  } = event.payload;

  return {
    date: modifiéLe,
    title: 'Producteur modifié',
    actor: modifiéPar,
    file: pièceJustificative && {
      document: Lauréat.Producteur.DocumentProducteur.pièceJustificative({
        identifiantProjet,
        enregistréLe: modifiéLe,
        pièceJustificative,
      }),
      ariaLabel: `Télécharger le justificatif du changement de producteur enregistré le ${formatDateToText(modifiéLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau producteur : <span className="font-semibold">{producteur}</span>
        </div>
        <div>
          <span>
            Numéro SIRET :{' '}
            <FormattedSIRET className="font-semibold" value={numéroIdentification?.siret} />
          </span>
        </div>
      </div>
    ),
    reason: raison,
  };
};
