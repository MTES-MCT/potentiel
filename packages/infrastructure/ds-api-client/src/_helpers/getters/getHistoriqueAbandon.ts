import { Candidature } from '@potentiel-domain/projet';

import { DossierAccessor } from '../../graphql/index.js';
import { mapSelectToValueType } from '../mappers/mapSelectToValueType.js';

const typeHistoriqueAbandonMap = {
  "Le projet n'a jamais fait l'objet d'une candidature à un appel d'offres passé.":
    'première-candidature',
  "Le projet a déjà fait l'objet d'une candidature à un appel d'offres mais n'a pas été retenu.":
    'première-candidature',
  "Le projet a été lauréat d'un appel d'offres et a demandé l'abandon de son statut":
    'abandon-classique',
} satisfies Partial<Record<string, Candidature.HistoriqueAbandon.RawType>>;

export const getHistoriqueAbandon = <
  T extends Record<string, string>,
  TName extends string & keyof T,
>(
  accessor: DossierAccessor<T>,
  nom: TName,
) => mapSelectToValueType(typeHistoriqueAbandonMap, accessor, nom);
