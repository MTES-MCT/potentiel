import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { FormattedDate } from '@/components/atoms/FormattedDate';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToDemandeComplèteRaccordementModifiéeTimelineItemProps = (
  event: (
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV1
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV2
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEventV3
    | Lauréat.Raccordement.DemandeComplèteRaccordementModifiéeEvent
  ) & { createdAt: string },
): TimelineItemProps => {
  const { dateQualification, identifiantProjet } = event.payload;
  const modifiéeLe: DateTime.RawType =
    'modifiéeLe' in event.payload
      ? event.payload.modifiéeLe
      : DateTime.convertirEnValueType(event.createdAt).formatter();

  const modifiéePar: string | undefined =
    'modifiéePar' in event.payload ? event.payload.modifiéePar : undefined;

  const accuséRéception: { format: string } | undefined =
    'accuséRéception' in event.payload ? event.payload.accuséRéception : undefined;

  const référenceDossier =
    event.type === 'DemandeComplèteRaccordementModifiée-V1'
      ? event.payload.nouvelleReference
      : event.payload.référenceDossierRaccordement;

  const ancienneRéférenceDossier =
    event.type === 'DemandeComplèteRaccordementModifiée-V1'
      ? event.payload.referenceActuelle
      : undefined;

  return {
    date: modifiéeLe,
    actor: modifiéePar,
    title: 'Demande complète de raccordement modifiée',
    details: (
      <div className="flex flex-col">
        {ancienneRéférenceDossier && (
          <span>
            Ancienne référence du dossier :{' '}
            <span className="font-semibold">{ancienneRéférenceDossier}</span>
          </span>
        )}
        <span>
          Référence du dossier : <span className="font-semibold">{référenceDossier}</span>
        </span>
        <span>
          Date de l'accusé de réception :{' '}
          <FormattedDate className="font-semibold" date={dateQualification} />
        </span>
      </div>
    ),
    file:
      accuséRéception && dateQualification
        ? {
            document: Lauréat.Raccordement.DocumentRaccordement.accuséRéception({
              identifiantProjet,
              référenceDossierRaccordement: référenceDossier,
              dateQualification,
              accuséRéception,
            }),
            label: "Télécharger l'accusé de réception",
            ariaLabel: `Télécharger l'accusé de réception du dossier ${référenceDossier}`,
          }
        : undefined,
  };
};
