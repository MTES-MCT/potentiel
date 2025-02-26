import { match } from 'ts-pattern';

import { TâcheAjoutéeEvent, TâcheEntity } from '@potentiel-domain/tache';
import { getLogger } from '@potentiel-libraries/monitoring';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Option } from '@potentiel-libraries/monads';

import { upsertProjection } from '../../../infrastructure';

const récupérerProjet = async (identifiantProjet: string) => {
  const projetEntity = await CandidatureAdapter.récupérerProjetAdapter(identifiantProjet);

  const projet = Option.match(projetEntity)
    .some<TâcheEntity['projet']>(({ nom, appelOffre, période, numéroCRE, famille }) => ({
      appelOffre,
      nom,
      numéroCRE,
      période,
      famille: match(famille)
        .with('', () => undefined)
        .otherwise((value) => value),
    }))
    .none(() => undefined);

  return projet;
};

export const tâcheAjoutéeProjector = async ({
  payload: { identifiantProjet, typeTâche, ajoutéeLe },
}: TâcheAjoutéeEvent) => {
  const projet = await récupérerProjet(identifiantProjet);

  if (!projet) {
    getLogger().warn(`Projet inconnu !`, { identifiantProjet: identifiantProjet });
  }

  await upsertProjection<TâcheEntity>(`tâche|${typeTâche}#${identifiantProjet}`, {
    identifiantProjet,
    projet,
    typeTâche: typeTâche,
    misÀJourLe: ajoutéeLe,
  });
};
