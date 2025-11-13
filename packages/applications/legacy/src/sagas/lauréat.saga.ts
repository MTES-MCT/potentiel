import { ok } from 'neverthrow';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Lauréat } from '@potentiel-domain/projet';
import {
  CahierDesChargesChoisi,
  ProjectClasseGranted,
  ProjectCompletionDueDateSet,
  ProjectDataCorrected,
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
import { getUserByEmail } from '../config';

export type SubscriptionEvent = (
  | Lauréat.LauréatNotifiéEvent
  | Lauréat.SiteDeProductionModifiéEvent
  | Lauréat.NomProjetModifiéEvent
  | Lauréat.CahierDesChargesChoisiEvent
  | Lauréat.ChangementNomProjetEnregistréEvent
) &
  Event;

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
      case 'LauréatNotifié-V2': {
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
      case 'SiteDeProductionModifié-V1': {
        const userId = await new Promise<string>((r) =>
          getUserByEmail(event.payload.modifiéPar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );
        await eventStore.publish(
          new ProjectDataCorrected({
            payload: {
              correctedBy: userId,
              projectId: projet.id,
              correctedData: {
                adresseProjet: [event.payload.localité.adresse1, event.payload.localité.adresse2]
                  .filter(Boolean)
                  .join('\n'),
                communeProjet: event.payload.localité.commune,
                codePostalProjet: event.payload.localité.codePostal,
                departementProjet: event.payload.localité.département,
                regionProjet: event.payload.localité.région,
              },
            },
          }),
        );
        return;
      }
      case 'NomProjetModifié-V1': {
        const userId = await new Promise<string>((r) =>
          getUserByEmail(event.payload.modifiéPar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );
        await eventStore.publish(
          new ProjectDataCorrected({
            payload: {
              correctedBy: userId,
              projectId: projet.id,
              correctedData: {
                nomProjet: event.payload.nomProjet,
              },
            },
          }),
        );
        return;
      }
      case 'ChangementNomProjetEnregistré-V1': {
        const userId = await new Promise<string>((r) =>
          getUserByEmail(event.payload.enregistréPar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );
        await eventStore.publish(
          new ProjectDataCorrected({
            payload: {
              correctedBy: userId,
              projectId: projet.id,
              correctedData: {
                nomProjet: event.payload.nomProjet,
              },
            },
          }),
        );
        return;
      }
      case 'CahierDesChargesChoisi-V1': {
        const userId = await new Promise<string>((r) =>
          getUserByEmail(event.payload.modifiéPar).map((user) => {
            r(user?.id ?? '');
            return ok(user);
          }),
        );
        const cahierDesCharges = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(
          event.payload.cahierDesCharges,
        );
        await eventStore.publish(
          cahierDesCharges.type === 'initial'
            ? new CahierDesChargesChoisi({
                payload: {
                  projetId: projet.id,
                  choisiPar: userId,
                  type: 'initial',
                },
              })
            : new CahierDesChargesChoisi({
                payload: {
                  projetId: projet.id,
                  choisiPar: userId,
                  type: 'modifié',
                  paruLe: cahierDesCharges.paruLe,
                  alternatif: cahierDesCharges.alternatif,
                },
              }),
        );
      }
    }
  };

  mediator.register('System.Saga.Lauréat', handler);
};
