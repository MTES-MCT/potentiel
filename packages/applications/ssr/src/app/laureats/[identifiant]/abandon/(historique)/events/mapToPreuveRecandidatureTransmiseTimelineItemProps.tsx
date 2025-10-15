import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { TimelineItemUserEmail } from '@/components/organisms/timeline';

export const mapToPreuveRecandidatureTransmiseTimelineItemProps = (
  preuveRecandidatureTransmise: Lauréat.Abandon.PreuveRecandidatureTransmiseEvent,
) => {
  const { preuveRecandidature, transmiseLe, transmisePar } = preuveRecandidatureTransmise.payload;

  return {
    date: transmiseLe,
    title: (
      <div>
        Le{' '}
        <Link
          href={Routes.Projet.details(preuveRecandidature)}
          aria-label={`voir le projet faisant office de preuve de recandidature`}
        >
          projet faisant preuve de recandidature
        </Link>{' '}
        a été transmis <TimelineItemUserEmail email={transmisePar} />
      </div>
    ),
  };
};
