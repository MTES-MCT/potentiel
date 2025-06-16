import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToMainlevéeGarantiesFinancièresDemandéeTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { demandéLe, demandéPar, motif } =
      modification.payload as GarantiesFinancières.MainlevéeGarantiesFinancièresDemandéeEvent['payload'];

    return {
      date: demandéLe,
      icon,
      title: (
        <div>
          La mainlevée des garanties financières a été demandée par{' '}
          <span className="font-semibold">{demandéPar}</span>{' '}
        </div>
      ),
      content: (
        <div>
          Motif : <span className="font-semibold">{motif}</span>
        </div>
      ),
    };
  };
