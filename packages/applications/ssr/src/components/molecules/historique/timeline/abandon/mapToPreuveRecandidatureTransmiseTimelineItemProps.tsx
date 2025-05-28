import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';
import { Historique } from '@potentiel-domain/historique';
import { Lauréat } from '@potentiel-domain/projet';

export const mapToPreuveRecandidatureTransmiseTimelineItemProps = (
  preuveRecandidatureTransmise: Historique.ListerHistoriqueProjetReadModel['items'][number],
) => {
  const { preuveRecandidature, transmiseLe, transmisePar } =
    preuveRecandidatureTransmise.payload as Lauréat.Abandon.PreuveRecandidatureTransmiseEvent['payload'];

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
