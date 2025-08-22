import { type Message, type MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { OperationRejectedError } from '@potentiel-domain/core';
import type { Find } from '@potentiel-domain/entity';
import type { UtilisateurEntity } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import type { CandidatureEntity } from '../../candidature';
import type { LauréatEntity } from '../../lauréat';
import type { RaccordementEntity } from '../../lauréat/raccordement';
import type { AccèsEntity } from '../accès.entity';

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
};

class ProjetInaccessibleError extends OperationRejectedError {
  constructor() {
    super(`Vous n'avez pas accès à ce projet`);
  }
}

export const registerVérifierAccèsProjetQuery = ({ find }: VérifierAccèsProjetDependencies) => {
  const handler: MessageHandler<VérifierAccèsProjetQuery> = async ({
    identifiantUtilisateurValue,
    identifiantProjetValue,
  }) => {
    const identifiantUtilisateur = identifiantUtilisateurValue.toLocaleLowerCase();

    const utilisateur = await find<UtilisateurEntity>(`utilisateur|${identifiantUtilisateur}`);

    return Option.match(utilisateur)
      .some(async (utilisateur) => {
        const hasAccess = await match(utilisateur)
          .with({ rôle: 'acheteur-obligé' }, () =>
            estUneCandidatureNotifiée(identifiantProjetValue),
          )
          .with({ rôle: 'ademe' }, () => estUneCandidatureNotifiée(identifiantProjetValue))
          .with({ rôle: 'admin' }, async () => true)
          .with({ rôle: 'caisse-des-dépôts' }, () =>
            estUneCandidatureNotifiée(identifiantProjetValue),
          )
          .with({ rôle: 'cre' }, async () => true)
          .with({ rôle: 'dgec-validateur' }, async () => true)
          .with({ rôle: 'dreal' }, async (utilisateur) => {
            const projetNotifié = await estUneCandidatureNotifiée(identifiantProjetValue);

            if (!projetNotifié) {
              return false;
            }

            if (utilisateur.région) {
              const régionProjet = await récuperérRégionProjet(identifiantProjetValue);
              return régionProjet === utilisateur.région;
            }

            return false;
          })
          .with({ rôle: 'grd' }, async (utilisateur) => {
            if (utilisateur.identifiantGestionnaireRéseau) {
              const identifiantGestionnaireRéseau =
                await récupérerIdentifiantGestionnaireRéseauProjet(identifiantProjetValue);
              return identifiantGestionnaireRéseau === utilisateur.identifiantGestionnaireRéseau;
            }

            return false;
          })
          .with({ rôle: 'porteur-projet' }, async () => {
            const accès = await find<AccèsEntity>(`accès|${identifiantProjetValue}`);

            return Option.match(accès)
              .some((accès) => accès.utilisateursAyantAccès.includes(identifiantUtilisateur))
              .none(() => false);
          })
          .exhaustive();

        if (!hasAccess) {
          throw new ProjetInaccessibleError();
        }
      })
      .none(() => {
        throw new ProjetInaccessibleError();
      });
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
