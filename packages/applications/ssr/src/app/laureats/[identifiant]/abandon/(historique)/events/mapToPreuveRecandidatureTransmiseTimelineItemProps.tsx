import { Routes } from '@potentiel-applications/routes';
import type { Lauréat } from '@potentiel-domain/projet';

import { Link } from '@/components/atoms/LinkNoPrefetch';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToPreuveRecandidatureTransmiseTimelineItemProps = (
  event: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent,
): TimelineItemProps => {
  const { preuveRecandidature, transmiseLe, transmisePar } = event.payload;

  return {
    date: transmiseLe,
    title: (
      <>
        Le{' '}
        <Link
          href={Routes.Projet.details(preuveRecandidature)}
          aria-label={`voir le projet faisant office de preuve de recandidature`}
        >
          projet faisant preuve de recandidature
        </Link>{' '}
        a été transmis
      </>
    ),
    actor: transmisePar,
  };
};
