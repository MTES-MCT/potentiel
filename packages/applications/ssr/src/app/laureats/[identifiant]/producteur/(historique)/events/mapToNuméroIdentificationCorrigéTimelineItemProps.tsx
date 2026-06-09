import { Lauréat } from '@potentiel-domain/projet';

import { formatDateToText } from '@/app/_helpers';
import { FormattedSIRET } from '@/components/atoms/FormattedNuméroIdentification';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToNuméroIdentificationCorrigéTimelineItemProps = (
  event: Lauréat.Producteur.NuméroIdentificationCorrigéEvent,
): TimelineItemProps => {
  const { corrigéLe, corrigéPar, raison, numéroIdentification } = event.payload;
  return {
    date: corrigéLe,
    title: "Numéro d'identification corrigé",
    actor: corrigéPar,
    file: {
      document: Lauréat.Producteur.DocumentProducteur.numéroIdentificationCorrigé(event.payload),
      ariaLabel: `Télécharger le justificatif de la correction effectuée le ${formatDateToText(corrigéLe)}`,
    },
    details: (
      <div>
        Nouveau SIRET :{' '}
        <FormattedSIRET className="font-semibold" value={numéroIdentification.siret} />
      </div>
    ),
    reason: raison,
  };
};
