import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemProps } from '@/components/organisms/timeline';

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
    acteur: transmisePar,
  };
};
