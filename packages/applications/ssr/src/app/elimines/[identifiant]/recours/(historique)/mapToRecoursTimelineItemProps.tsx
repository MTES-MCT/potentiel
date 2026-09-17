import { match, P } from 'ts-pattern';

import type { Éliminé } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import type { TimelineItemProps } from '@/components/organisms/timeline';
import {
  mapToRecoursAccordéTimelineItemProps,
  mapToRecoursAnnuléTimelineItemProps,
  mapToRecoursDemandéTimelineItemProps,
  mapToRecoursPasséEnInstructionTimelineItemProp,
  mapToRecoursRejetéTimelineItemProps,
} from './events';

export const mapToRecoursTimelineItemProps = (
  event: Éliminé.Recours.HistoriqueRecoursProjetListItemReadModel,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
) =>
  match(event)
    .returnType<TimelineItemProps>()
    .with(
      {
        type: 'RecoursDemandé-V1',
      },
      (event) => mapToRecoursDemandéTimelineItemProps(event, rôleUtilisateur),
    )
    .with(
      {
        type: 'RecoursAnnulé-V1',
      },
      mapToRecoursAnnuléTimelineItemProps,
    )
    .with(
      {
        type: P.union('RecoursAccordé-V1', 'RecoursAccordé-V2'),
      },
      mapToRecoursAccordéTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursRejeté-V1',
      },
      mapToRecoursRejetéTimelineItemProps,
    )
    .with(
      {
        type: 'RecoursPasséEnInstruction-V1',
      },
      mapToRecoursPasséEnInstructionTimelineItemProp,
    )
    .exhaustive();
