import { Message, MessageHandler, mediator } from 'mediateur';
import { Event } from '@potentiel-infrastructure/pg-event-sourcing';
import { Recours } from '@potentiel-domain/elimine';
import { getLegacyIdByIdentifiantProjet } from '../infra/sequelize/queries/project/getLegacyIdByIdentifiantProjet';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { User as UserModel } from '../infra/sequelize';
import { randomUUID } from 'crypto';
import { fileRepo, projectRepo } from '../infra/sequelize/repos';
import { UniqueEntityID } from '../core/domain';
import { getLogger } from '@potentiel-libraries/monitoring';
import { DocumentProjet, ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { makeAndSaveFile } from '../modules/file';
import { Readable } from 'node:stream';
import { ReadableStream } from 'stream/web';

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

        if (!projectId) {
          getLogger().warn('Identifiant projet inconnu', {
            saga: 'System.Saga.Recours',
            event,
          });

          return;
        }

        const {
          payload: { accordéPar, accordéLe, réponseSignée },
        } = event;

        const user = await UserModel.findOne({ where: { email: accordéPar } });
        if (!user) {
          getLogger().warn('Utilisateur inconnu', {
            saga: 'System.Saga.Recours',
            event,
          });

          return;
        }

        const document = DocumentProjet.convertirEnValueType(
          identifiantProjet.formatter(),
          Recours.TypeDocumentRecours.recoursAccordé.formatter(),
          accordéLe,
          réponseSignée.format,
        );

        const courrier = await mediator.send<ConsulterDocumentProjetQuery>({
          type: 'Document.Query.ConsulterDocumentProjet',
          data: {
            documentKey: document.formatter(),
          },
        });

        return new Promise<void>((resolve) => {
          makeAndSaveFile({
            file: {
              designation: 'modification-request-response',
              forProject: new UniqueEntityID(projectId),
              createdBy: new UniqueEntityID(randomUUID()),
              filename: `${Recours.TypeDocumentRecours.recoursAccordé.type}.${courrier.format}`,
              contents: Readable.fromWeb(courrier.content as ReadableStream),
            },
            fileRepo,
          })
            .mapErr((error) => {
              getLogger().error(new Error('La sauvegarde du courrier côté legacy a échouée'), {
                saga: 'System.Saga.Recours',
                event,
                error,
              });
              resolve();
            })
            .andThen((fileId) =>
              projectRepo.load(new UniqueEntityID(projectId)).andThen((project) =>
                project
                  .grantClasse(user)
                  .andThen(() => project.updateCertificate(user, fileId))
                  .andThen(() => project.setNotificationDate(user, new Date(accordéLe).getTime())),
              ),
            )
            .mapErr((error) => {
              getLogger().error(
                new Error('La désgnation comme lauréat du projet côté legacy a échouée'),
                {
                  saga: 'System.Saga.Recours',
                  event,
                  error,
                },
              );
              resolve();
            })
            .map(() => {
              resolve();
            });
        });
    }
    return Promise.reject();
  };

  mediator.register('System.Saga.Recours', handler);
};
