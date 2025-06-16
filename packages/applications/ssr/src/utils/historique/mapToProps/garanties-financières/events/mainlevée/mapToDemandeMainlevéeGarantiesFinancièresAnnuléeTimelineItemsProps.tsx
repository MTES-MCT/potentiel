import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToDemandeMainlevéeGarantiesFinancièresAnnuléeTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { annuléLe, annuléPar } =
      modification.payload as GarantiesFinancières.DemandeMainlevéeGarantiesFinancièresAnnuléeEvent['payload'];

    return {
      date: annuléLe,
      icon,
      title: (
        <div>
          La demande de mainlevée des garanties financières a été annulée par{' '}
          <span className="font-semibold">{annuléPar}</span>{' '}
        </div>
      ),
    };
  };
