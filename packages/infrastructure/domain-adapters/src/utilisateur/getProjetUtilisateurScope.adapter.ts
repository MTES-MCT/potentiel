import { match } from 'ts-pattern';

import { Where } from '@potentiel-domain/entity';
import {
  type Accès,
  type GetProjetUtilisateurScope,
  IdentifiantProjet,
  type ProjetUtilisateurScope,
} from '@potentiel-domain/projet';
import type { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getProjetUtilisateurScopeAdapter: GetProjetUtilisateurScope = async (email) => {
  const utilisateur = await findProjection<UtilisateurEntity>(`utilisateur|${email.formatter()}`);

  if (Option.isNone(utilisateur)) {
    return {
      type: 'projet',
      identifiantProjets: [],
    };
  }

  return match(utilisateur)
    .returnType<Promise<ProjetUtilisateurScope>>()
    .with({ rôle: 'dreal' }, async (value) => ({ type: 'region', region: value.région }))
    .with({ rôle: 'porteur-projet' }, async () => {
      const { items } = await listProjection<Accès.AccèsEntity>(`accès`, {
        where: {
          utilisateursAyantAccès: Where.contain(utilisateur.identifiantUtilisateur),
        },
      });
      return {
        type: 'projet',
        identifiantProjets: items.map(({ identifiantProjet }) =>
          IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
        ),
      };
    })
    .otherwise(async () => ({ type: 'all' }));
};
