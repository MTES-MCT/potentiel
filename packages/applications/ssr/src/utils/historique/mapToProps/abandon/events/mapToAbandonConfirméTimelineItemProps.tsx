import Link from 'next/link';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { HistoriqueItem } from '@/utils/historique/HistoriqueItem.type';

export const mapToAbandonConfirméTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.AbandonConfirméEvent
> = ({ event, withLink }) => {
  const { confirméLe, confirméPar, identifiantProjet } = event.payload;

  return {
    date: confirméLe,
    title: (
      <div>
        {withLink ? (
          <Link href={Routes.Abandon.détail(identifiantProjet)}>
            Demande d'abandon confirmée par
          </Link>
        ) : (
          `Demande d'abandon confirmée`
        )}
        par {<span className="font-semibold">{confirméPar}</span>}
      </div>
    ),
  };
};
