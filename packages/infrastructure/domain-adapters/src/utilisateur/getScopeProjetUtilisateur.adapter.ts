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

export const getScopeProjetUtilisateurAdapter: GetScopeProjetUtilisateur = async (
  email,
  filterOnScope,
) => {
  const utilisateur = await findProjection<UtilisateurEntity>(`utilisateur|${email.formatter()}`);

  if (Option.isNone(utilisateur)) {
    return {
      régions: [],
      identifiantProjets: [],
      identifiantGestionnaireRéseau: '__IDENTIFIANT_MANQUANT__',
    };
  }

  const filters = filterOnScope ?? {};

  return match(utilisateur)
    .returnType<Promise<ProjetUtilisateurScope>>()
    .with({ rôle: 'dreal' }, async (value) => {
      const drealRégions = value.région ? [value.région] : [];

      return {
        ...filters,
        régions: filters?.régions
          ? filters.régions.filter((région) => drealRégions.includes(région))
          : drealRégions,
      };
    })
    .with({ rôle: 'porteur-projet' }, async () => {
      const { items } = await listProjection<Accès.AccèsEntity>(`accès`, {
        where: {
          utilisateursAyantAccès: Where.include(utilisateur.identifiantUtilisateur),
        },
      });

      const identifiantProjetsDuPorteur = items.map(({ identifiantProjet }) =>
        IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      );

      return {
        ...filters,
        identifiantProjets: filters?.identifiantProjets
          ? filters.identifiantProjets.filter((id) => identifiantProjetsDuPorteur.includes(id))
          : identifiantProjetsDuPorteur,
      };
    })
    .with({ rôle: 'grd' }, async ({ identifiantGestionnaireRéseau }) => {
      return {
        ...filters,
        identifiantGestionnaireRéseau: identifiantGestionnaireRéseau || '__IDENTIFIANT_MANQUANT__',
      };
    })
    .with({ rôle: 'cocontractant' }, async (value) => ({
      ...filters,
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

      const identifiantProjetPourCaisseDesDépôts = projetsAvecGfConsignation.items.map(
        ({ identifiantProjet }) =>
          IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      );

      return {
        ...filters,
        identifiantProjets: filters?.identifiantProjets?.length
          ? filters.identifiantProjets.filter((id) =>
              identifiantProjetPourCaisseDesDépôts.includes(id),
            )
          : identifiantProjetPourCaisseDesDépôts,
      };
    })
    .with({ rôle: 'admin' }, async () => filters)
    .with({ rôle: 'dgec-validateur' }, async () => filters)
    .with({ rôle: 'cre' }, async () => filters)
    .with({ rôle: 'ademe' }, async () => filters)
    .exhaustive();
};
