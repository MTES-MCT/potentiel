import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { HistoriqueItem } from '@/utils/historique/HistoriqueItem.type';

export const mapToPreuveRecandidatureTransmiseTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.PreuveRecandidatureTransmiseEvent
> = ({ event }) => {
  const { preuveRecandidature, transmiseLe, transmisePar } = event.payload;

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
        a été transmis par {<span className="font-semibold">{transmisePar}</span>}
      </div>
    ),
  };
};
