import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/laureat';
import { publishToEventBus } from '../config/eventBus.config';
import {
  ProjectCompletionDueDateSet,
  ProjectDCRDueDateSet,
  ProjectNotified,
} from '../modules/project';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { getLegacyProjetByIdentifiantProjet } from '../infra/sequelize/queries/project';
import { logger } from '../core/utils';
import { getDelaiDeRealisation } from '../modules/projectAppelOffre';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

export type SubscriptionEvent = Lauréat.LauréatNotifié & Event;

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
        await publishToEventBus(
          new ProjectNotified({
            payload: {
              appelOffreId: identifiantProjet.appelOffre,
              periodeId: identifiantProjet.période,
              familleId: identifiantProjet.famille || undefined,
              candidateEmail: projet.email,
              candidateName: projet.nomCandidat,
              notifiedOn: new Date(payload.notifiéLe).getTime(),
              projectId: projet.id,
            },
          }),
        );

        const notifiedOn = DateTime.convertirEnValueType(payload.notifiéLe);
        const completionDueOn = getCompletionDate(
          notifiedOn,
          appelOffre,
          projet.technologie ?? 'N/A',
        );
        await publishToEventBus(
          new ProjectCompletionDueDateSet({
            payload: {
              projectId: projet.id,
              completionDueOn: completionDueOn.date.getTime(),
              setBy: payload.notifiéPar,
            },
          }),
        );

        await publishToEventBus(
          new ProjectDCRDueDateSet({
            payload: {
              projectId: projet.id,
              dcrDueOn: notifiedOn
                .ajouterNombreDeMois(période.delaiDcrEnMois.valeur)
                .date.getTime(),
            },
          }),
        );
        return;
    }
  };

  mediator.register('System.Saga.Lauréat', handler);
};

function getCompletionDate(
  notifiedOn: DateTime.ValueType,
  appelOffre: AppelOffre.AppelOffreReadModel,
  technologie: AppelOffre.Technologie,
) {
  const moisAAjouter = getDelaiDeRealisation(appelOffre, technologie) || 0;
  return notifiedOn.ajouterNombreDeMois(moisAAjouter).retirerNombreDeJours(1);
}
