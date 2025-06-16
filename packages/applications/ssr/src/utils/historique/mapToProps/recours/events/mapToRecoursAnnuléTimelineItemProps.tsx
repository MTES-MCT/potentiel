import { Éliminé } from '@potentiel-domain/projet';

import { MapToRecoursTimelineItemProps } from '../mapToRecoursTimelineItemProps';

export const mapToRecoursAnnuléTimelineItemProps: MapToRecoursTimelineItemProps = (
  recoursAnnulé,
  icon,
) => {
  const { annuléLe, annuléPar } =
    recoursAnnulé.payload as Éliminé.Recours.RecoursAnnuléEvent['payload'];

  return {
    date: annuléLe,
    icon,
    title: (
      <div>Demande de recours annulée par {<span className="font-semibold">{annuléPar}</span>}</div>
    ),
  };
};
