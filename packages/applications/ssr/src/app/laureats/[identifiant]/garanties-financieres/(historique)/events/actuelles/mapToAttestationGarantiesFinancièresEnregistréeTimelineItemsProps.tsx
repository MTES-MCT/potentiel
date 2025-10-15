import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps = (
  modification: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent,
) => {
  const { enregistréLe, enregistréPar } = modification.payload;

  return {
    date: enregistréLe,
    title: (
      <div>
        Attestation de garanties financières enregistrée{' '}
        <TimelineItemUserEmail email={enregistréPar} />
      </div>
    ),
  };
};
