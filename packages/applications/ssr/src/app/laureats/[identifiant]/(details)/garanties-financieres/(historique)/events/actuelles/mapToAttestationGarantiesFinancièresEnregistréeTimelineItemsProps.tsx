import { Lauréat } from '@potentiel-domain/projet';

import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToAttestationGarantiesFinancièresEnregistréeTimelineItemsProps = (
  event: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, attestation, identifiantProjet, dateConstitution } =
    event.payload;

  return {
    date: enregistréLe,
    title: 'Attestation de garanties financières enregistrée',
    actor: enregistréPar,
    file: attestation && {
      document: Lauréat.GarantiesFinancières.DocumentGarantiesFinancières.attestationActuelle({
        identifiantProjet,
        dateConstitution,
        attestation: attestation,
      }),
      ariaLabel: `Télécharger l'attestation de garanties financière`,
    },
  };
};
