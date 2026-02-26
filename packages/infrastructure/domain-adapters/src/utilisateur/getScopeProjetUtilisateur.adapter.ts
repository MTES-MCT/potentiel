import { match } from 'ts-pattern';

import { Option } from '@potentiel-libraries/monads';
import {
  GetScopeProjetUtilisateur,
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
      identifiantGestionnaireRéseau: '',
      identifiantProjets: [],
    };
  }

  const scopeValues = filterOnScope ? filterOnScope : {};

  match(utilisateur)
    .with({ rôle: 'dreal' }, (value) => {
      scopeValues.régions = value.région ? [value.région] : [];
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

      scopeValues.identifiantProjets = filterOnScope?.identifiantProjets
        ? filterOnScope.identifiantProjets.filter((id) => identifiantProjetsDuPorteur.includes(id))
        : identifiantProjetsDuPorteur;
    })
    .with({ rôle: 'grd' }, ({ identifiantGestionnaireRéseau }) => {
      scopeValues.identifiantGestionnaireRéseau =
        identifiantGestionnaireRéseau || '__IDENTIFIANT_MANQUANT__';
    })
    .with({ rôle: 'cocontractant' }, (value) => {
      scopeValues.régions = Région.régions.filter((région) =>
        Zone.convertirEnValueType(value.zone).aAccèsàLaRégion(région),
      );
    })
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

      scopeValues.identifiantProjets = filterOnScope?.identifiantProjets
        ? filterOnScope.identifiantProjets.filter((id) =>
            identifiantProjetPourCaisseDesDépôts.includes(id),
          )
        : identifiantProjetPourCaisseDesDépôts;
    })
    .with({ rôle: 'admin' }, () => {})
    .with({ rôle: 'dgec-validateur' }, () => {})
    .with({ rôle: 'cre' }, () => {})
    .with({ rôle: 'ademe' }, () => {})
    .exhaustive();

  console.log('viovio', scopeValues);
  return scopeValues;
};
