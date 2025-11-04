import { Message, MessageHandler, mediator } from 'mediateur';
import { match, P } from 'ts-pattern';

import { Find } from '@potentiel-domain/entity';
import { OperationRejectedError } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Role, UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { Email } from '@potentiel-domain/common';

import { LauréatEntity } from '../../lauréat';
import { CandidatureEntity } from '../../candidature';
import { RaccordementEntity } from '../../lauréat/raccordement';
import { GetProjetUtilisateurScope } from '../../getScopeProjetUtilisateur.port';
import { IdentifiantProjet } from '../..';

export type VérifierAccèsProjetQuery = Message<
  'System.Projet.Accès.Query.VérifierAccèsProjet',
  {
    identifiantUtilisateurValue: string;
    identifiantProjetValue: string;
  },
  void
>;

export type VérifierAccèsProjetDependencies = {
  find: Find;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

class ProjetInaccessibleError extends OperationRejectedError {
  constructor() {
    super(`Vous n'avez pas accès à ce projet`);
  }
}

export const registerVérifierAccèsProjetQuery = ({
  find,
  getScopeProjetUtilisateur,
}: VérifierAccèsProjetDependencies) => {
  const handler: MessageHandler<VérifierAccèsProjetQuery> = async ({
    identifiantUtilisateurValue,
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const identifiantUtilisateur = Email.convertirEnValueType(identifiantUtilisateurValue);

    const utilisateur = await find<UtilisateurEntity>(
      `utilisateur|${identifiantUtilisateur.formatter()}`,
    );
    if (Option.isNone(utilisateur)) {
      throw new ProjetInaccessibleError();
    }
    // NB : ici on pourrait passer `utilisateur` pour optimiser le double appel à find<UtilisateurEntity>
    const scope = await getScopeProjetUtilisateur(identifiantUtilisateur);

    const accèsCandidature = await match(utilisateur.rôle)
      .with(P.union(Role.dgecValidateur.nom, Role.admin.nom, Role.cre.nom), () => true)
      .otherwise(() => estUneCandidatureNotifiée(identifiantProjetValue));

    if (!accèsCandidature) {
      throw new ProjetInaccessibleError();
    }

    const accèsProjet = await match(scope)
      .with({ type: 'projet' }, ({ identifiantProjets }) =>
        identifiantProjets.includes(identifiantProjet.formatter()),
      )
      .with({ type: 'région' }, async ({ régions }) => {
        const régionProjet = await récuperérRégionProjet(identifiantProjetValue);
        return régions.includes(régionProjet);
      })
      .with({ type: 'gestionnaire-réseau' }, async ({ identifiantGestionnaireRéseau }) => {
        const identifiantGestionnaireRéseauProjet =
          await récupérerIdentifiantGestionnaireRéseauProjet(identifiantProjetValue);
        return identifiantGestionnaireRéseau === identifiantGestionnaireRéseauProjet;
      })
      .with({ type: 'all' }, async () => true)
      .exhaustive();

    if (!accèsProjet) {
      throw new ProjetInaccessibleError();
    }
  };

  const récuperérRégionProjet = async (identifiantProjet: string) => {
    const lauréat = await find<LauréatEntity>(`lauréat|${identifiantProjet}`, {
      select: ['localité.région'],
    });

    if (Option.isSome(lauréat)) {
      return lauréat.localité.région;
    }

    const candidature = await find<CandidatureEntity>(`candidature|${identifiantProjet}`);
    if (Option.isSome(candidature) && candidature.estNotifiée) {
      return candidature.localité.région;
    }

    return '__AUCUNE RÉGION__';
  };

  const récupérerIdentifiantGestionnaireRéseauProjet = async (identifiantProjet: string) => {
    const raccordement = await find<RaccordementEntity>(`raccordement|${identifiantProjet}`, {
      select: ['identifiantGestionnaireRéseau'],
    });

    if (Option.isSome(raccordement)) {
      return raccordement.identifiantGestionnaireRéseau;
    }

    return '__AUCUN RACCORDEMENT__';
  };

  const estUneCandidatureNotifiée = async (identifiantProjet: string) => {
    const candidature = await find<CandidatureEntity>(`candidature|${identifiantProjet}`);

    return Option.match(candidature)
      .some((candidature) => !!candidature.notification)
      .none(() => false);
  };

  mediator.register('System.Projet.Accès.Query.VérifierAccèsProjet', handler);
};
