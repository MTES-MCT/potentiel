import { Message, MessageHandler, mediator } from 'mediateur';

import { getLogger } from '@potentiel-libraries/monitoring';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Candidature } from '@potentiel-domain/candidature';
import { Lauréat } from '@potentiel-domain/laureat';
import { Éliminé } from '@potentiel-domain/projet';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { InviterPorteurUseCase } from '@potentiel-domain/utilisateur';

import { loadPériodeFactory } from '../période.aggregate';
import * as IdentifiantPériode from '../identifiantPériode.valueType';

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

export const registerNotifierPériodeCommand = (loadAggregate: LoadAggregate) => {
  const loadPériode = loadPériodeFactory(loadAggregate);
  const loadCandidature = Candidature.Aggregate.loadCandidatureFactory(loadAggregate);

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
      const candidature = await loadCandidature(identifiantCandidature);

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
          invitéParValue: Email.system().formatter(),
        },
      });
    }

    const période = await loadPériode(identifiantPériode, false);
    await période.notifier({
      identifiantPériode,
      notifiéeLe,
      notifiéePar,
      identifiantLauréats,
      identifiantÉliminés,
    });
  };

  mediator.register('Période.Command.NotifierPériode', handler);
};
