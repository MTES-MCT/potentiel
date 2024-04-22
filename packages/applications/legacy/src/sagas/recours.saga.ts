import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Recours } from '@potentiel-domain/elimine';
import { getLegacyIdByIdentifiantProjet } from '../infra/sequelize/queries/project/getLegacyIdByIdentifiantProjet';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { publishToEventBus } from '../config/eventBus.config';
import { ProjectCertificateGenerated, ProjectClasseGranted } from '../modules/project';
import { File } from '../infra/sequelize';

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type SubscriptionEvent = Recours.RecoursEvent & Event;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export type Execute = Message<'System.Saga.Recours', SubscriptionEvent>;

/**
 * @deprecated à bouger dans la nouvelle app
 */
export const register = () => {
  const handler: MessageHandler<Execute> = async (event) => {
    switch (event.type) {
      case 'RecoursAccordé-V1':
        const identifiantProjet = IdentifiantProjet.convertirEnValueType(
          event.payload.identifiantProjet,
        );
        const projectId = await getLegacyIdByIdentifiantProjet(identifiantProjet);
        const {
          payload: { accordéPar, accordéLe },
        } = event;

        if (projectId) {
          await File.create({
            id: file.id.toString(),
            filename: file.filename,
            forProject: projectId,
            createdBy: file.createdBy?.toString(),
            createdAt: new Date(accordéLe),
            designation: file.designation,
            storedAt: storedAt,
          });

          return new Promise<void>((resolve) => {
            publishToEventBus(
              new ProjectClasseGranted({
                payload: {
                  grantedBy: accordéPar,
                  projectId,
                },
              }),
            ).map(() => {
              publishToEventBus(
                new ProjectCertificateGenerated({
                  payload: {
                    projectId: props.projectId.toString(),
                    projectVersionDate,
                    certificateFileId,
                    appelOffreId: props.appelOffre.id,
                    periodeId: props.appelOffre.periode.id,
                    candidateEmail: props.data?.email || '',
                  },
                }),
              ).map(() => {
                resolve();
              });
            });
          });
        } else {
          logger.warning('Identifiant projet inconnu', {
            saga: 'System.Saga.Recours',
            event,
          });
        }
    }
    return Promise.reject();
  };

  mediator.register('System.Saga.Recours', handler);
};
