import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeComplèteDeRaccordementTransmiseTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV1
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEventV2
    | Lauréat.Raccordement.DemandeComplèteRaccordementTransmiseEvent
  ) & {
    createdAt: string;
  },
): TimelineItemProps => {
  const { référenceDossierRaccordement, dateQualification, identifiantProjet } = event.payload;

  const transmiseLe: DateTime.RawType =
    'transmiseLe' in event.payload
      ? event.payload.transmiseLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const transmisePar: string | undefined =
    'transmisePar' in event.payload ? event.payload.transmisePar : undefined;

  const accuséRéception: { format: string } | undefined =
    'accuséRéception' in event.payload ? event.payload.accuséRéception : undefined;

  return {
    date: transmiseLe,
    actor: transmisePar,
    title: 'Nouveau dossier de raccordement crée',
    details: (
      <div className="flex flex-col">
        <span>
          Référence du dossier :{' '}
          <span className="font-semibold">{référenceDossierRaccordement}</span>
        </span>
        {dateQualification && (
          <span>
            Date de l'accusé de réception :{' '}
            <FormattedDate className="font-semibold" date={dateQualification} />
          </span>
        )}
      </div>
    ),
    file:
      accuséRéception && dateQualification
        ? {
            document: Lauréat.Raccordement.DocumentRaccordement.accuséRéception({
              identifiantProjet,
              référenceDossierRaccordement,
              dateQualification,
              accuséRéception,
            }),
            label: "Télécharger l'accusé de réception",
            ariaLabel: `Télécharger l'accusé de réception du dossier ${référenceDossierRaccordement}`,
          }
        : undefined,
  };
};
