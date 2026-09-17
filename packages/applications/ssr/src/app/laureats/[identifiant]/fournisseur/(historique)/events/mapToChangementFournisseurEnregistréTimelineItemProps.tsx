import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { formatDateToText } from '@/app/_helpers';
import { ListeFournisseurs } from '@/app/laureats/[identifiant]/fournisseur/changement/ListeFournisseurs';
import type { TimelineItemProps } from '@/components/organisms/timeline';

export const mapToChangementFournisseurEnregistréTimelineItemProps = (
  event: Lauréat.Fournisseur.ChangementFournisseurEnregistréEvent,
  rôleUtilisateur: Utilisateur.ValueType['rôle'],
): TimelineItemProps => {
  const {
    enregistréLe,
    enregistréPar,
    identifiantProjet,
    pièceJustificative,
    évaluationCarboneSimplifiée,
    fournisseurs,
    raison,
  } = event.payload;

  const afficherLien = rôleUtilisateur.aLaPermission('fournisseur.consulterChangement');

  return {
    date: enregistréLe,
    title: 'Fournisseur modifié',
    actor: enregistréPar,
    file: {
      document: Lauréat.Fournisseur.DocumentFournisseur.pièceJustificative({
        identifiantProjet,
        enregistréLe,
        pièceJustificative: {
          format: pièceJustificative.format,
        },
      }),
      ariaLabel: `Télécharger le justificatif du changement de fournisseur en date du ${formatDateToText(enregistréLe)}`,
    },
    details: (
      <div className="flex flex-col gap-2">
        {évaluationCarboneSimplifiée !== undefined && (
          <div>
            Nouvelle évaluation carbone simplifiée :{' '}
            <span className="font-semibold">{évaluationCarboneSimplifiée} kg eq CO2/kWc</span>
          </div>
        )}
        {fournisseurs && (
          <div>
            Nouvelle liste de fournisseurs :{' '}
            <ListeFournisseurs
              fournisseurs={fournisseurs.map(Lauréat.Fournisseur.Fournisseur.convertirEnValueType)}
            />{' '}
          </div>
        )}
      </div>
    ),
    reason: raison,
    link: afficherLien
      ? {
          url: Routes.Fournisseur.changement.détails(identifiantProjet, enregistréLe),
          label: 'Détail du changement',
          ariaLabel: `Voir le détail du changement de fournisseur enregistré le ${formatDateToText(enregistréLe)}`,
        }
      : undefined,
  };
};
