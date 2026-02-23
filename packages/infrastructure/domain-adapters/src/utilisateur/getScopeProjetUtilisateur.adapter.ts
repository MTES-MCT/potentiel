import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import {
  GetScopeProjetUtilisateur,
  ProjetUtilisateurScope,
  Accès,
  IdentifiantProjet,
  Lauréat,
} from '@potentiel-domain/projet';
import { Région, UtilisateurEntity, Zone } from '@potentiel-domain/utilisateur';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Where } from '@potentiel-domain/entity';

export const getScopeProjetUtilisateur: GetScopeProjetUtilisateur = async (email) => {
  const utilisateur = await findProjection<UtilisateurEntity>(`utilisateur|${email.formatter()}`);

  if (Option.isNone(utilisateur)) {
    return {
      type: 'projet',
      identifiantProjets: [],
    };
  }

  return (
    match(utilisateur)
      .returnType<Promise<ProjetUtilisateurScope>>()
      // Pour les query avec le rôle DREAL, on filtre sur la région (propriété localité) du projet pour ne pas avoir à récupérer tous les identifiant projets
      .with({ rôle: 'dreal' }, async (value) => ({
        type: 'région',
        régions: value.région ? [value.région] : [],
      }))
      // Pour les query avec le rôle porteur, on filtre sur l'identifiant projet
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
      // Pour les query avec le rôle porteur, on filtre sur l'identifiant du gestionnaire réseau du raccordement
      .with({ rôle: 'grd' }, async ({ identifiantGestionnaireRéseau }) => ({
        type: 'gestionnaire-réseau',
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseau || '__IDENTIFIANT_MANQUANT__',
      }))
      // Pour les query avec le rôle cocontractant, on filtre sur la région
      .with({ rôle: 'cocontractant' }, async (value) => ({
        type: 'région',
        régions: Région.régions.filter((région) =>
          Zone.convertirEnValueType(value.zone).aAccèsàLaRégion(région),
        ),
      }))
      .with({ rôle: 'caisse-des-dépôts' }, async () => {
        const projetsAvecGfConsignation =
          await listProjection<Lauréat.GarantiesFinancières.GarantiesFinancièresEntity>(
            `garanties-financieres`,
            {
              where: {
                garantiesFinancières: {
                  type: Where.equal('consignation'),
                },
              },
              select: ['identifiantProjet'],
            },
          );

        return {
          type: 'projet',
          identifiantProjets: projetsAvecGfConsignation.items.map(({ identifiantProjet }) =>
            IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
          ),
        };
      })
      .with({ rôle: 'admin' }, async () => ({ type: 'all' }))
      .with({ rôle: 'dgec-validateur' }, async () => ({ type: 'all' }))
      .with({ rôle: 'cre' }, async () => ({ type: 'all' }))
      .with({ rôle: 'ademe' }, async () => ({ type: 'all' }))
      .exhaustive()
  );
};
