import { match } from 'ts-pattern';

import type { HistoryRecord } from '@potentiel-domain/entity';
import type { Lauréat } from '@potentiel-domain/projet';

export const itemDoitÊtreAffiché = (
  event: Lauréat.HistoriqueListItemReadModels,
  historique: ReadonlyArray<Lauréat.HistoriqueListItemReadModels>,
) => {
  // on ne veut pas afficher dans l'historique complet les événements d'import de chaque domaine
  // qui arrive après la désignation
  if (event.type?.includes('Import')) {
    return false;
  }
  // les événements candidature (ex: CandidatureNotifiée) sont présents dans l'historique
  // brut (table domain_views.history partagée par tous les sous-agrégats) mais absents du
  // type HistoriqueListItemReadModels (car on veut pas qu'ils le soient); ils sont déjà représentés dans l'historique
  // lauréat/éliminé par LauréatNotifié/ÉliminéNotifié
  if ((event.category as string) === 'candidature') {
    return false;
  }
  // dans de rares cas de projets désignés hors Potentiel,
  // on a pas l'information de la date de notification du projet éliminé
  // on choisit de ne pas afficher une date erronnée de notification du projet éliminé
  if (event.category === 'éliminé' && event.type === 'ÉliminéNotifié-V1') {
    const lauréatNotifié = historique.find(isLauréatNotifié);
    if (lauréatNotifié && lauréatNotifié.payload.notifiéLe === event.payload.notifiéLe) {
      return false;
    }
  }
  return true;
};

const isLauréatNotifié = (
  item: Lauréat.HistoriqueListItemReadModels,
): item is HistoryRecord<
  'lauréat',
  Lauréat.LauréatNotifiéEvent | Lauréat.LauréatNotifiéV1Event
> => {
  if (item.category !== 'lauréat') {
    return false;
  }
  return match(item)
    .with({ type: 'LauréatNotifié-V1' }, () => true)
    .with({ type: 'LauréatNotifié-V2' }, () => true)
    .with({ type: 'CahierDesChargesChoisi-V1' }, () => false)
    .with({ type: 'NomProjetModifié-V1' }, () => false)
    .with({ type: 'SiteDeProductionModifié-V1' }, () => false)
    .with({ type: 'NomEtLocalitéLauréatImportés-V1' }, () => false)
    .with({ type: 'ChangementNomProjetEnregistré-V1' }, () => false)
    .with({ type: 'StatutLauréatModifié-V1' }, () => false)
    .exhaustive();
};
