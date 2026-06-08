import { match } from 'ts-pattern';

import type { Lauréat } from '@potentiel-domain/projet';

export const getTypeReprésentantLégalLabel = (
  type: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType,
) =>
  match(type)
    .returnType<string>()
    .with('personne-physique', () => 'Personne physique')
    .with('personne-morale', () => 'Personne morale')
    .with('collectivité', () => 'Collectivité')
    .with('autre', () => 'Organisme')
    .with('inconnu', () => 'Inconnu')
    .exhaustive();

export const getPiècesJustificativesText = (
  typeReprésentantLégal: Lauréat.ReprésentantLégal.TypeReprésentantLégal.RawType,
  estEnCoursDeConstitution: boolean,
): string =>
  match(typeReprésentantLégal)
    .returnType<string>()
    .with(
      'personne-physique',
      () => "Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité",
    )
    .with('personne-morale', () =>
      match(estEnCoursDeConstitution)
        .returnType<string>()
        .with(
          true,
          () =>
            "Une copie des statuts de la société, une attestation de récépissé de dépôt de fonds pour constitution de capital social, une copie de l'acte désignant le représentant légal de la société",
        )
        .with(false, () => 'un extrait Kbis')
        .exhaustive(),
    )
    .with('collectivité', () => 'Un extrait de délibération portant sur le projet')
    .with(
      'autre',
      () => "Tout document officiel permettant d'attester de l'existence juridique de l'organisme",
    )
    .with(
      'inconnu',
      () =>
        'Veuillez sélectionner le type de représentant légal pour voir les pièces justificatives à fournir',
    )
    .exhaustive();
