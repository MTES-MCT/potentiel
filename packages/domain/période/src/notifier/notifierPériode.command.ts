import { Message, MessageHandler, mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { LoadAggregate } from '@potentiel-domain/core';
import { Accès, GetProjetAggregateRoot, IdentifiantProjet } from '@potentiel-domain/projet';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime, Email } from '@potentiel-domain/common';

import * as IdentifiantPériode from '../identifiantPériode.valueType';
import { PériodeAggregate } from '../période.aggregate';

export type NotifierPériodeCommand = Message<
  'Période.Command.NotifierPériode',
  {
    identifiantPériode: IdentifiantPériode.ValueType;
    notifiéeLe: DateTime.ValueType;
    notifiéePar: Email.ValueType;
    validateur: AppelOffre.Validateur;
    identifiantCandidatures: ReadonlyArray<IdentifiantProjet.ValueType>;
  }
>;

export const registerNotifierPériodeCommand = (
  loadAggregate: LoadAggregate,
  getProjetAggregateRoot: GetProjetAggregateRoot,
) => {
  const handler: MessageHandler<NotifierPériodeCommand> = async ({
    identifiantPériode,
    notifiéeLe,
    notifiéePar,
    validateur,
    identifiantCandidatures,
  }) => {
    const identifiantLauréats: Array<IdentifiantProjet.ValueType> = [];
    const identifiantÉliminés: Array<IdentifiantProjet.ValueType> = [];

    const porteursAInviter: Record<Email.RawType, IdentifiantProjet.RawType[]> = {};

    let nbError = 0;
    for (const identifiantCandidature of identifiantCandidatures) {
      const projet = await getProjetAggregateRoot(identifiantCandidature, true);
      await projet.initCandidature();

      try {
        await projet.candidature.notifier({
          notifiéeLe,
          notifiéePar,
          validateur,
          attestation: {
            format: 'application/pdf',
          },
        });

        if (projet.candidature.statut?.estClassé()) {
          identifiantLauréats.push(identifiantCandidature);
        }

        if (projet.candidature.statut?.estÉliminé()) {
          identifiantÉliminés.push(identifiantCandidature);
        }

        const emailPorteur = projet.candidature.emailContact.formatter();
        porteursAInviter[emailPorteur] ??= [];
        porteursAInviter[emailPorteur].push(identifiantCandidature.formatter());
      } catch (error) {
        nbError++;
        if (nbError === identifiantCandidatures.length) {
          throw error;
        }
        getLogger().error(error as Error, { identifiantCandidature });
      }
    }

    for (const [email, projets] of Object.entries(porteursAInviter)) {
      await mediator.send<InviterPorteurUseCase>({
        type: 'Utilisateur.UseCase.InviterPorteur',
        data: {
          identifiantUtilisateurValue: email,
          identifiantsProjetValues: projets,
          invitéLeValue: notifiéeLe.formatter(),
          invitéParValue: Email.système.formatter(),
        },
      });

      for (const identifiantProjetValue of projets) {
        await mediator.send<Accès.AutoriserAccèsProjetUseCase>({
          type: 'Projet.Accès.UseCase.AutoriserAccèsProjet',
          data: {
            identifiantProjetValue,
            identifiantUtilisateurValue: email,
            autoriséLeValue: notifiéeLe.formatter(),
            autoriséParValue: Email.système.formatter(),
            raison: 'notification',
          },
        });
      }
    }

    const période = await loadAggregate(
      PériodeAggregate,
      `période|${identifiantPériode.formatter()}`,
      undefined,
    );
    await période.notifier({
      notifiéeLe,
      notifiéePar,
      identifiantLauréats,
      identifiantÉliminés,
    });
  };

  mediator.register('Période.Command.NotifierPériode', handler);
};
