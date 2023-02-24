import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { resetDatabase } from '../../helpers';
import { ProjectEvent } from '../../projectionsNext/projectEvents/projectEvent.model';
import { getProjectEvents } from './getProjectEvents';
import models from '../../models';
import makeFakeProject from '../../../../__tests__/fixtures/project';

describe('getProjectEvents pou un projet legacy', () => {
  const { Project } = models;
  const projectId = new UniqueEntityID().toString();
  const fakeProject = makeFakeProject({ id: projectId, potentielIdentifier: 'pot-id' });

  beforeEach(async () => {
    await resetDatabase();
    await Project.create(fakeProject);
  });

  it(`Etant donné une utlisateur admin, 
  lorsqu'il visualise la frise d'un projet legacy, 
  alors 
  - la date de notification devrait être prise dans le payload de l'événement ProjectImported
  - isLegacy doit être à true dans l'événement ProjectNotified`, async () => {
    const utilisateur = { role: 'admin' } as User;
    const dateNotification = new Date().getTime();
    const projectImportedEvent = {
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectImported',
      valueDate: 1,
      eventPublishedAt: 1,
      payload: {
        notifiedOn: dateNotification,
      },
    };
    const projectNotificationDateSetEvent = {
      id: new UniqueEntityID().toString(),
      projectId,
      type: 'ProjectNotificationDateSet',
      valueDate: 3,
      eventPublishedAt: 3,
    };

    await ProjectEvent.bulkCreate([projectImportedEvent, projectNotificationDateSetEvent]);

    const res = await getProjectEvents({ projectId, user: utilisateur });

    expect(res._unsafeUnwrap().events).toEqual([
      {
        type: 'ProjectImported',
        date: 1,
        variant: utilisateur.role,
      },
      {
        type: 'ProjectNotified',
        date: dateNotification,
        variant: utilisateur.role,
        isLegacy: true,
      },
      {
        type: 'ProjectNotificationDateSet',
        date: 3,
        variant: utilisateur.role,
      },
    ]);
  });
});
