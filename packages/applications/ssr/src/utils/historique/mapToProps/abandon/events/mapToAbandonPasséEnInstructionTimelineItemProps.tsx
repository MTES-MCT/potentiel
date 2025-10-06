import Link from 'next/link';

import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { HistoriqueItem } from '@/utils/historique/HistoriqueItem.type';

export const mapToAbandonPasséEnInstructionTimelineItemProps: HistoriqueItem<
  Lauréat.Abandon.AbandonPasséEnInstructionEvent
> = ({ event, withLink }) => {
  const { passéEnInstructionLe, passéEnInstructionPar, identifiantProjet } = event.payload;

  return {
    date: passéEnInstructionLe,
    title: (
      <div>
        {withLink ? (
          <Link href={Routes.Abandon.détail(identifiantProjet)}>
            Demande d'abandon passée en instruction
          </Link>
        ) : (
          `Demande d'abandon passée en instruction`
        )}
        par {<span className="font-semibold">{passéEnInstructionPar}</span>}
      </div>
    ),
  };
};
