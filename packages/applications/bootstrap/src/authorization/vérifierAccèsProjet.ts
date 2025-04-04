import { match } from 'ts-pattern';

import { VérifierAccèsProjetPort } from '@potentiel-domain/utilisateur';
import { Lauréat, Raccordement } from '@potentiel-domain/laureat';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';

import { récupererProjetsPorteurAdapter } from './récupérerIdentifiantsProjetParPorteur';

const récuperérRégionProjet = async (identifiantProjet: IdentifiantProjet.ValueType) => {
  const lauréat = await findProjection<Lauréat.LauréatEntity>(
    `lauréat|${identifiantProjet.formatter()}`,
    { select: ['localité.région'] },
  );
  if (Option.isSome(lauréat)) {
    return lauréat.localité.région;
  }

  const candidature = await findProjection<Candidature.CandidatureEntity>(
    `candidature|${identifiantProjet.formatter()}`,
  );
  if (Option.isSome(candidature) && candidature.estNotifiée) {
    return candidature.localité.région;
  }
  return '__AUCUNE RÉGION__';
};

const récupérerIdentifiantGestionnaireRéseauProjet = async (
  identifiantProjet: IdentifiantProjet.ValueType,
) => {
  const raccordement = await findProjection<Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet.formatter()}`,
    { select: ['identifiantGestionnaireRéseau'] },
  );
  if (Option.isSome(raccordement)) {
    return raccordement.identifiantGestionnaireRéseau;
  }
  return '__AUCUN RACCORDEMENT__';
};

export const vérifierAccèsProjetAdapter: VérifierAccèsProjetPort = async ({
  identifiantProjetValue,
  utilisateur,
}) => {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
  return match(utilisateur)
    .with({ role: { nom: 'acheteur-obligé' } }, async () => true)
    .with({ role: { nom: 'ademe' } }, async () => true)
    .with({ role: { nom: 'admin' } }, async () => true)
    .with({ role: { nom: 'caisse-des-dépôts' } }, async () => true)
    .with({ role: { nom: 'cre' } }, async () => true)
    .with({ role: { nom: 'dgec-validateur' } }, async () => true)
    .with({ role: { nom: 'dreal' } }, async (utilisateur) => {
      if (utilisateur.région) {
        const régionProjet = await récuperérRégionProjet(identifiantProjet);
        return régionProjet === utilisateur.région;
      }
      return false;
    })
    .with({ role: { nom: 'grd' } }, async (utilisateur) => {
      if (utilisateur.identifiantGestionnaireRéseau) {
        const identifiantGestionnaireRéseau =
          await récupérerIdentifiantGestionnaireRéseauProjet(identifiantProjet);
        return identifiantGestionnaireRéseau === utilisateur.identifiantGestionnaireRéseau;
      }
      return false;
    })
    .with({ role: { nom: 'porteur-projet' } }, async (utilisateur) => {
      const projets = await récupererProjetsPorteurAdapter(
        utilisateur.identifiantUtilisateur.formatter(),
      );
      return projets.includes(identifiantProjet.formatter());
    })
    .exhaustive();
};
