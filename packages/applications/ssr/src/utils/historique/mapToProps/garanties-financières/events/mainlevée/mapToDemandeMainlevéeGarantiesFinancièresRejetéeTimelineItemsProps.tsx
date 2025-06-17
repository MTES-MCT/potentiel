import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDemandeMainlevéeGarantiesFinancièresRejetéeTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { rejetéLe, rejetéPar } =
      modification.payload as GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresRejetéeEvent['payload'];

    return {
      date: rejetéLe,
      icon,
      title: (
        <div>
          La demande de mainlevée des garanties financières a été rejetée par{' '}
          <span className="font-semibold">{rejetéPar}</span>{' '}
        </div>
      ),
    };
  };
