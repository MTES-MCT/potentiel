import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import { GetScopeProjetUtilisateur, ScopeProjetUtilisateur } from '@potentiel-domain/projet';
import { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { UtilisateurInconnuError } from '@potentiel-domain/utilisateur';

export const getScopeProjetUtilisateurAdapter: GetScopeProjetUtilisateur = async (email) => {
  const utilisateur = await findProjection<UtilisateurEntity>(`utilisateur|${email.formatter()}`);

  if (Option.isNone(utilisateur)) {
    throw new UtilisateurInconnuError();
  }

  return match(utilisateur)
    .returnType<ScopeProjetUtilisateur>()
    .with(
      {
        rôle: 'dreal',
      },
      (value) => ({
        type: 'dreal',
        region: value.région,
      }),
    )
    .with(
      {
        rôle: 'porteur-projet',
      },
      (value) => ({
        type: 'porteur',
        identifiantProjets: value.projets,
      }),
    )
    .otherwise(() => ({
      type: 'none',
    }));
};
