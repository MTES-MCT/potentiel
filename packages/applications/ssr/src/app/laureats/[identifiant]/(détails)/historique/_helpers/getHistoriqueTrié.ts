import type { Lauréat } from '@potentiel-domain/projet';

import type { getLauréatInfos } from '@/app/_helpers';
import type { TimelineItemProps } from '@/components/organisms/timeline';
import { aUnRecoursAccordé } from './aUnRecoursAccordé';
import { itemDoitÊtreAffiché } from './itemDoitEtreAffiché';
import { mapToTimelineItemProps } from './mapToTimelineItemProps';
import { trierParJourPuisOrdreDInsertion } from './trierParJourPuisOrdreDInsertion';

type GetHistoriqueTriéProps = {
  items: ReadonlyArray<Lauréat.HistoriqueListItemReadModels>;
  unitéPuissance: string;
  attestationDésignation: Awaited<ReturnType<typeof getLauréatInfos>>['attestationDésignation'];
};

/**
 *
 * Construit la liste des items affichés dans l'historique du lauréat, tous domaines
 * confondus (éliminé, recours, garanties financières, raccordement, ...), à partir des
 * évènements bruts renvoyés par ListerHistoriqueProjetQuery :
 *
 * 1. on retire les évènements techniques qui ne doivent jamais être affichés
 * 2. on convertit chaque évènement en item d'affichage (TimelineItemProps)
 * 3. on trie le résultat pour l'affichage (cf trierParJourPuisOrdreDInsertion)
 *
 */
export const getHistoriqueTrié = ({
  items,
  unitéPuissance,
  attestationDésignation,
}: GetHistoriqueTriéProps): TimelineItemProps[] => {
  const doitAfficherLienAttestationDésignation =
    !aUnRecoursAccordé(items) && !!attestationDésignation;

  const itemsAffichés = [...items]
    .filter((item) => itemDoitÊtreAffiché(item, items))
    // ordre d'insertion réel des évènements, causalement correct : sert de repère au tri
    // final quand deux items affichent la même date métier (cf trierParJourPuisOrdreDInsertion)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((item) =>
      mapToTimelineItemProps({
        readmodel: item,
        unitéPuissance,
        doitAfficherLienAttestationDésignation,
      }),
    )
    .filter((item) => item !== undefined);

  return trierParJourPuisOrdreDInsertion({ items: itemsAffichés, dateOf: (item) => item.date });
};
