import { match } from 'ts-pattern';

import { TâcheEntity } from '@potentiel-domain/tache';
import { CandidatureAdapter } from '@potentiel-infrastructure/domain-adapters';
import { Option } from '@potentiel-libraries/monads';

export const récupérerProjet = async (identifiantProjet: string) => {
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
