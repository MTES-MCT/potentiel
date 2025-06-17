import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { enregistréLe, enregistréPar } =
      modification.payload as GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent['payload'];

    return {
      date: enregistréLe,
      icon,
      title: (
        <div>
          Attestion de garanties financières enregistrée par{' '}
          {<span className="font-semibold">{enregistréPar}</span>}
        </div>
      ),
    };
  };
