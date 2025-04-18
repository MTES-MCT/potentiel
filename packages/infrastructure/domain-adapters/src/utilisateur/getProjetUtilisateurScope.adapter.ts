import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { GetProjetUtilisateurScope, ProjetUtilisateurScope } from '@potentiel-domain/projet';
import { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { UtilisateurInconnuError } from '@potentiel-domain/utilisateur';

export const getProjetUtilisateurScopeAdapter: GetProjetUtilisateurScope = async (email) => {
  const utilisateur = await findProjection<UtilisateurEntity>(`utilisateur|${email.formatter()}`);

  if (Option.isNone(utilisateur)) {
    throw new UtilisateurInconnuError();
  }

  return match(utilisateur)
    .returnType<ProjetUtilisateurScope>()
    .with(
      {
        rôle: 'dreal',
      },
      (value) => ({
        type: 'region',
        region: value.région,
      }),
    )
    .with(
      {
        rôle: 'porteur-projet',
      },
      (value) => ({
        type: 'projet',
        identifiantProjets: value.projets,
      }),
    )
    .otherwise(() => ({
      type: 'all',
    }));
};
