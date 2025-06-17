import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDemandeMainlevéeGarantiesFinancièresAccordéeTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { accordéLe, accordéPar } =
      modification.payload as GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAccordéeEvent['payload'];

    return {
      date: accordéLe,
      icon,
      title: (
        <div>
          La demande de mainlevée des garanties financières a été accordée par{' '}
          <span className="font-semibold">{accordéPar}</span>{' '}
        </div>
      ),
    };
  };
