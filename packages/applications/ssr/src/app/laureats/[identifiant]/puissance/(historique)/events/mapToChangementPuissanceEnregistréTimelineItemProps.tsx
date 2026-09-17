import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementPuissanceEnregistréTimelineItemProps = (
  event: Lauréat.Puissance.ChangementPuissanceEnregistréEvent,
  unitéPuissance: string,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
): TimelineItemProps => {
  const {
    enregistréLe,
    enregistréPar,
    identifiantProjet,
    pièceJustificative,
    puissance,
    puissanceDeSite,
    raison,
  } = event.payload;

  const afficherLien = rôleUtilisateur.aLaPermission('puissance.consulterChangement');
  return {
    date: enregistréLe,
    title: 'Puissance modifiée',
    actor: enregistréPar,
    file: pièceJustificative && {
      document: Lauréat.Puissance.DocumentPuissance.pièceJustificative({
        identifiantProjet,
        demandéLe: enregistréLe,
        pièceJustificative,
      }),
      ariaLabel: `Télécharger le justificatif du changement de puissance en date du ${formatDateToText(enregistréLe)}`,
    },
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
    reason: raison,
    link: afficherLien
      ? {
          url: Routes.Puissance.changement.détails(identifiantProjet, enregistréLe),
          label: 'Détail du changement',
          ariaLabel: `Voir le détail du changement de puissance enregistré le ${formatDateToText(enregistréLe)}`,
        }
      : undefined,
  };
};
