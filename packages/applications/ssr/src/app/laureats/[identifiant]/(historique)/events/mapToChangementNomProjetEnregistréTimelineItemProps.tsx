import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementNomProjetEnregistréTimelineItemProps = (
  event: Lauréat.ChangementNomProjetEnregistréEvent,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
): TimelineItemProps => {
  const {
    nomProjet,
    enregistréLe,
    enregistréPar,
    raison,
    identifiantProjet,
    ancienNomProjet,
    pièceJustificative,
  } = event.payload;

  const afficherLien = rôleUtilisateur.aLaPermission('nomProjet.consulterChangement');

  return {
    date: enregistréLe,
    title: 'Nom du projet modifié',
    actor: enregistréPar,
    file: {
      document: Lauréat.DocumentNomProjet.pièceJustificative({
        identifiantProjet,
        enregistréLe,
        pièceJustificative,
      }),
      ariaLabel: `Télécharger le justificatif de la modification du nom du projet en date du ${formatDateToText(enregistréLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        <div>
          Nouveau nom : <span className="font-semibold">{nomProjet}</span>
        </div>
        <div>
          Ancien nom : <span className="font-semibold">{ancienNomProjet}</span>
        </div>
      </div>
    ),
    reason: raison,
    link: afficherLien
      ? {
          url: Routes.Lauréat.changement.nomProjet.détails(identifiantProjet, enregistréLe),
          label: 'Détail du changement',
          ariaLabel: `Voir le détail du changement de nom du projet enregistré le ${formatDateToText(enregistréLe)}`,
        }
      : undefined,
  };
};
