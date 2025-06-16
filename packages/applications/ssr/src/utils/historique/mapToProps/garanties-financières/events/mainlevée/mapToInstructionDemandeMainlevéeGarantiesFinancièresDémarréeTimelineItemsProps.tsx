import { GarantiesFinancières } from '@potentiel-domain/laureat';

import { MapToGarantiesFinancièresTimelineItemProps } from '../../mapToGarantiesFinancièresTimelineItemProps';

export const mapToInstructionDemandeMainlevéeGarantiesFinancièresDémarréeTimelineItemsProps: MapToGarantiesFinancièresTimelineItemProps =
  (modification, icon) => {
    const { démarréLe, démarréPar } =
      modification.payload as GarantiesFinancières.InstructionDemandeMainlevéeGarantiesFinancièresDémarréeEvent['payload'];

    return {
      date: démarréLe,
      icon,
      title: (
        <div>
          L'instruction de la demande de mainlevée des garanties financières a été démarée par{' '}
          <span className="font-semibold">{démarréPar}</span>{' '}
        </div>
      ),
    };
  };
