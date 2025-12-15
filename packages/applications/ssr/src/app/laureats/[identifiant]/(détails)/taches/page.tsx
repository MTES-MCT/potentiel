import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { checkFeatureFlag } from '../_helpers/checkFeatureFlag';

import { getTâches } from './_helpers/getTâches';
import { ListHeader } from '@/components/organisms/ListHeader';
import { TâcheListItem } from '../../../../taches/TâcheListItem';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Tile } from '@/components/organisms/Tile';

type PageProps = IdentifiantParameter & {
  searchParams?: Record<string, string>;
};

export default async function Page({ params: { identifiant }, searchParams }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      checkFeatureFlag(identifiantProjet, searchParams);

      const tâches = await getTâches(
        identifiantProjet.formatter(),
        utilisateur.identifiantUtilisateur.email,
      );

      return (
        <div className="flex flex-col items-end">
          <div className="flex flex-col gap-3 w-3/4">
            <ListHeader filters={[]} totalCount={tâches.items.length} />
            {tâches.items.length ? (
              <ul>
                {mapToPlainObject(tâches.items).map((item, index) => (
                  <li className="mb-6" key={`${item.typeTâche}${index}`}>
                    <Tile className="flex flex-col md:flex-row md:justify-between">
                      <TâcheListItem {...item} />
                    </Tile>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-grow">Aucun résultat à afficher</div>
            )}
          </div>
        </div>
      );
    }),
  );
}
