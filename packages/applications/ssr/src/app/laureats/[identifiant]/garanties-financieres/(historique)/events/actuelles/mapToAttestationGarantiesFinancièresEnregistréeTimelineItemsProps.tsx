import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar } = event.payload;

  return {
    date: enregistréLe,
    title: 'Attestation de garanties financières enregistrée',
    acteur: enregistréPar,
  };
};
