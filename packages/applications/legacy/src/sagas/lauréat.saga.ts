import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/laureat';
import {
  ProjectClasseGranted,
  ProjectCompletionDueDateSet,
  ProjectDCRDueDateSet,
  ProjectNotified,
} from '../modules/project';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger } from '../core/utils';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';
import { CandidateNotifiedForPeriode } from '../modules/notificationCandidats';
import { eventStore } from '../config/eventStore.config';
import { getCompletionDate } from './_helpers/getCompletionDate';

export type SubscriptionEvent = Lauréat.LauréatNotifiéEvent & Event;

export type Execute = Message<'System.Saga.Lauréat', SubscriptionEvent>;

export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    const { payload, type } = event;

    const identifiantProjet = IdentifiantProjet.convertirEnValueType(payload.identifiantProjet);
    const projet = await getLegacyProjetByIdentifiantProjet(identifiantProjet);
    if (!projet) {
      logger.warning('Identifiant projet inconnu', {
        saga: 'System.Saga.Lauréat',
        event,
      });
      return;
    }

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });
    if (Option.isNone(appelOffre)) {
      throw new Error(`Appel offre ${identifiantProjet.appelOffre} non trouvée`);
    }
    const période = appelOffre.periodes.find((x) => x.id === identifiantProjet.période);
    if (!période) {
      throw new Error(
        `Période ${identifiantProjet.période} non trouvée pour l'AO ${identifiantProjet.appelOffre}`,
      );
    }

    switch (type) {
      case 'LauréatNotifié-V1':
        const basePayload = {
          appelOffreId: identifiantProjet.appelOffre,
          periodeId: identifiantProjet.période,
          candidateEmail: projet.email,
          candidateName: projet.nomRepresentantLegal,
        };
        await eventStore.publish(
          new ProjectNotified({
            payload: {
              ...basePayload,
              familleId: identifiantProjet.famille || undefined,

              notifiedOn: new Date(payload.notifiéLe).getTime(),
              projectId: projet.id,
            },
          }),
        );

        await eventStore.publish(
          new CandidateNotifiedForPeriode({
            payload: basePayload,
          }),
        );

        const notifiedOn = DateTime.convertirEnValueType(payload.notifiéLe);
        const completionDueOn = getCompletionDate(
          notifiedOn,
          appelOffre,
          projet.technologie ?? 'N/A',
        );
        await eventStore.publish(
          new ProjectCompletionDueDateSet({
            payload: {
              projectId: projet.id,
              completionDueOn: completionDueOn.date.getTime(),
              setBy: payload.notifiéPar,
            },
          }),
        );

        await eventStore.publish(
          new ProjectDCRDueDateSet({
            payload: {
              projectId: projet.id,
              dcrDueOn: notifiedOn
                .ajouterNombreDeMois(période.delaiDcrEnMois.valeur)
                .date.getTime(),
            },
          }),
        );

        await eventStore.publish(
          new ProjectClasseGranted({
            payload: {
              grantedBy: payload.notifiéPar,
              projectId: projet.id,
            },
          }),
        );
        return;
    }
  };

  mediator.register('System.Saga.Lauréat', handler);
};
