import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { USER_ROLES } from '@modules/users';
import { resetDatabase } from '../../helpers';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import { Project } from '@infra/sequelize/projectionsNext';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { FileAttachedToProjectEvent } from '@infra/sequelize/projectionsNext/projectEvents/events';

describe('getProjectEvents pour les événements de désignation', () => {
  const projectId = new UniqueEntityID().toString();
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' });

  const fileAttachedToProjectEvent = {
    id: new UniqueEntityID().toString(),
    projectId,
    type: 'FileAttachedToProject',
    valueDate: new Date('2020-01-01').getTime(),
    eventPublishedAt: new Date('2020-01-01').getTime(),
    payload: {
      title: 'title',
      description: 'description',
      files: [{ id: 'fileId', name: 'fileName' }],
      attachedBy: { id: 'user' },
      attachmentId: 'attachmentId',
    },
  } as FileAttachedToProjectEvent;

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(fakeProject);
  });

  const rolesAutorisés = ['admin', 'porteur-projet', 'dreal', 'dgec-validateur'];

  describe(`Utilisateurs autorisés à visualiser les fichiers attachés`, () => {
    for (const role of rolesAutorisés) {
      it(`Etant donné une utlisateur ${role}, 
  lorsqu'il visualise la frise d'un projet, 
  alors les données des fichiers attachées devraient être affichées`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.create(fileAttachedToProjectEvent);

        const res = await getProjectEvents({ projectId, user: utilisateur });

        expect(res._unsafeUnwrap().events).toEqual([
          {
            type: 'FileAttachedToProject',
            date: fileAttachedToProjectEvent.valueDate,
            variant: role,
            title: 'title',
            description: 'description',
            files: [{ id: 'fileId', name: 'fileName' }],
            isOwner: false,
            attachedBy: fileAttachedToProjectEvent.payload.attachedBy,
            attachmentId: fileAttachedToProjectEvent.payload.attachmentId,
            projectId,
          },
        ]);
      });
    }
  });

  describe(`Utilisateurs non autorisés à visualiser les fichiers attachés`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné une utlisateur ${role}, 
  lorsqu'il visualise la frise d'un projet, 
  alors les données des fichiers attachées ne devraient pas affichées`, async () => {
        const utilisateur = { role } as User;

        await ProjectEvent.create(fileAttachedToProjectEvent);

        const res = await getProjectEvents({ projectId, user: utilisateur });

        expect(res._unsafeUnwrap().events).toEqual([]);
      });
    }
  });
});
