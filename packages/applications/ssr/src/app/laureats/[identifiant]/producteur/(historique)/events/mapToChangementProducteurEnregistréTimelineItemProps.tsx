import { Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { TimelineItemProps } from '@/components/organisms/timeline';
import { formatDateToText } from '@/app/_helpers';

export const mapToChangementProducteurEnregistréTimelineItemProps = (
  event: Lauréat.Producteur.ChangementProducteurEnregistréEvent,
): TimelineItemProps => {
  const { enregistréLe, enregistréPar, identifiantProjet, producteur, raison } = event.payload;
  return {
    date: enregistréLe,
    title: 'Producteur modifié',
    actor: enregistréPar,
    file: {
      document: Lauréat.Producteur.DocumentProducteur.pièceJustificative(event.payload),
      ariaLabel: `Télécharger le justificatif du changement de producteur enregistré le ${formatDateToText(enregistréLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau producteur : <span className="font-semibold">{producteur}</span>
        </div>
      </div>
    ),
    reason: raison,
    link: {
      url: Routes.Producteur.changement.détails(identifiantProjet, enregistréLe),
      label: `Détail du changement`,
      ariaLabel: `Voir le détail du changement de producteur enregistré le ${formatDateToText(enregistréLe)}`,
    },
  };
};
