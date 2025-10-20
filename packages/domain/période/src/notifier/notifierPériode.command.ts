import { Message, MessageHandler, mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Accès, GetProjetAggregateRoot, Lauréat, Éliminé } from '@potentiel-domain/projet';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';

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
      const { candidature } = await getProjetAggregateRoot(identifiantCandidature);

      candidature.vérifierQueLaCandidatureExiste();

      try {
        if (candidature.statut?.estClassé()) {
          // TODO: devrait être appelé dans le usecase NotifierPériode
          await mediator.send<Lauréat.NotifierLauréatUseCase>({
            type: 'Lauréat.UseCase.NotifierLauréat',
            data: {
              identifiantProjetValue: identifiantCandidature.formatter(),
              notifiéLeValue: notifiéeLe.formatter(),
              notifiéParValue: notifiéePar.formatter(),
              validateurValue: validateur,
              attestationValue: {
                format: 'application/pdf',
              },
            },
          });

          identifiantLauréats.push(identifiantCandidature);
        }

        if (candidature.statut?.estÉliminé()) {
          // TODO: devrait être appelé dans le usecase NotifierPériode
          await mediator.send<Éliminé.NotifierÉliminéUseCase>({
            type: 'Éliminé.UseCase.NotifierÉliminé',
            data: {
              identifiantProjetValue: identifiantCandidature.formatter(),
              notifiéLeValue: notifiéeLe.formatter(),
              notifiéParValue: notifiéePar.formatter(),
              validateurValue: validateur,
              attestationValue: {
                format: 'application/pdf',
              },
            },
          });

          identifiantÉliminés.push(identifiantCandidature);
        }
        const emailPorteur = candidature.emailContact.formatter();
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
