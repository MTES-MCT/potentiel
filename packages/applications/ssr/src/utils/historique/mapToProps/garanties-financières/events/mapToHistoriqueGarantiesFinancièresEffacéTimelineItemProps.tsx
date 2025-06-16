import { Lauréat } from '@potentiel-domain/projet';

import { MapToGarantiesFinancièresTimelineItemProps } from '../mapToGarantiesFinancièresTimelineItemProps';

export const mapToHistoriqueGarantiesFinancièresEffacéTimelineItemProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { effacéLe, effacéPar } =
      modification.payload as Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent['payload'];

    return {
      date: effacéLe,
      icon,
      title: (
        <div>
          Toutes les garanties financières ont été supprimées par{' '}
          <span className="font-semibold">{effacéPar}</span>{' '}
        </div>
      ),
    };
  };
