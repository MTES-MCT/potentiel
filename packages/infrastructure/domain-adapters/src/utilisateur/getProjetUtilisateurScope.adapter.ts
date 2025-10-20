import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import {
  GetProjetUtilisateurScope,
  ProjetUtilisateurScope,
  Accès,
  IdentifiantProjet,
} from '@potentiel-domain/projet';
import { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Where } from '@potentiel-domain/entity';

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
          utilisateursAyantAccès: Where.include(utilisateur.identifiantUtilisateur),
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
