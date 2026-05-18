import type { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar } = event.payload;

  return {
    date: enregistréLe,
    title: 'Attestation de garanties financières enregistrée',
    actor: enregistréPar,
  };
};
