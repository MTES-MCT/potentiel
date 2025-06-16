import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { MapToEventTimelineItemsProps } from '../../mapToEventTimelineItemsProps.type';

export const mapToPreuveRecandidatureTransmiseTimelineItemProps: MapToEventTimelineItemsProps = (
  preuveRecandidatureTransmise,
  icon,
) => {
  const { preuveRecandidature, transmiseLe, transmisePar } =
    preuveRecandidatureTransmise.payload as Lauréat.Abandon.PreuveRecandidatureTransmiseEvent['payload'];

  return {
    date: transmiseLe,
    icon,
    title: (
      <div>
        Le{' '}
        <Link
          href={Routes.Projet.details(preuveRecandidature)}
          aria-label={`voir le projet faisant office de preuve de recandidature`}
        >
          projet faisant preuve de recandidature
        </Link>{' '}
        a été transmis par {<span className="font-semibold">{transmisePar}</span>}
      </div>
    ),
  };
};
