import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementPuissanceDemandéTimelineItemProps = ({
  event,
  unitéPuissance,
  rôleUtilisateur,
}: {
  event: Lauréat.Puissance.ChangementPuissanceDemandéEvent;
  unitéPuissance: string;
  rôleUtilisateur: Utilisateur.ValueType['rôle'];
}): TimelineItemProps => {
  const {
    identifiantProjet,
    demandéLe,
    demandéPar,
    pièceJustificative,
    puissance,
    puissanceDeSite,
  } = event.payload;

  return {
    date: demandéLe,
    title: 'Demande de changement de puissance déposée',
    actor: demandéPar,
    file: pièceJustificative && {
      document: Lauréat.Puissance.DocumentPuissance.pièceJustificative(event.payload),
      ariaLabel: `Télécharger le justificatif de la demande de changement de puissance en date du ${formatDateToText(demandéLe)}`,
    },
    link: rôleUtilisateur.aLaPermission('puissance.consulterChangement')
      ? {
          url: Routes.Puissance.changement.détails(identifiantProjet, demandéLe),
          label: 'Détail de la demande',
          ariaLabel: `Voir le détail de la demande de changement de puissance en date du ${formatDateToText(demandéLe)}`,
        }
      : undefined,
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouvelle puissance :{' '}
          <span className="font-semibold">
            {puissance} {unitéPuissance}
          </span>
        </div>
        {puissanceDeSite !== undefined ? (
          <div>
            Nouvelle puissance de site :{' '}
            <span className="font-semibold">
              {puissanceDeSite} {unitéPuissance}
            </span>
          </div>
        ) : null}
      </div>
    ),
  };
};
