import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import {
  GetProjetUtilisateurScope,
  ProjetUtilisateurScope,
  Accès,
  IdentifiantProjet,
} from '@potentiel-domain/projet';
import { Région, UtilisateurEntity, Zone } from '@potentiel-domain/utilisateur';
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
    .with({ rôle: 'dreal' }, async (value) => ({
      type: 'région',
      régions: value.région ? [value.région] : [],
    }))
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
    .with({ rôle: 'grd' }, async ({ identifiantGestionnaireRéseau }) => ({
      type: 'gestionnaire-réseau',
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau || '__IDENTIFIANT_MANQUANT__',
    }))
    .with({ rôle: 'cocontractant' }, async (value) => ({
      type: 'région',
      régions: Région.régions.filter((région) =>
        Zone.convertirEnValueType(value.zone).aAccèsàLaRégion(région),
      ),
    }))
    .with({ rôle: 'admin' }, async () => ({ type: 'all' }))
    .with({ rôle: 'dgec-validateur' }, async () => ({ type: 'all' }))
    .with({ rôle: 'cre' }, async () => ({ type: 'all' }))
    .with({ rôle: 'ademe' }, async () => ({ type: 'all' }))
    .with({ rôle: 'caisse-des-dépôts' }, async () => ({ type: 'all' }))
    .exhaustive();
};
