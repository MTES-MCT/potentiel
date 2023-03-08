import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { resetDatabase } from '../../helpers';
import { getProjectEvents } from './getProjectEvents';
import { Project } from '@infra/sequelize/projectionsNext';
import makeFakeProject from '../../../../__tests__/fixtures/project';

describe('getProjectEvents : statut du projet', () => {
  const projectId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
  });

  it(`Etant donné un projet lauréat, 
 alors le projet retourné devrait avoir le statut "Classé"`, async () => {
    const fakeProject = makeFakeProject({ id: projectId, classe: 'Classé' });
    await Project.create(fakeProject);

    const fakeUser = { role: 'porteur-projet' } as User;
    const res = await getProjectEvents({ projectId, user: fakeUser });

    expect(res._unsafeUnwrap()).toMatchObject({
      project: {
        id: projectId,
        status: 'Classé',
      },
    });
  });

  it(`Etant donné un projet éliminé, 
 alors le projet retourné devrait avoir le statut "Eliminé"`, async () => {
    const fakeProject = makeFakeProject({ id: projectId, classe: 'Eliminé' });
    await Project.create(fakeProject);

    const fakeUser = { role: 'porteur-projet' } as User;
    const res = await getProjectEvents({ projectId, user: fakeUser });

    expect(res._unsafeUnwrap()).toMatchObject({
      project: {
        id: projectId,
        status: 'Eliminé',
      },
    });
  });

  it(`Etant donné un projet avec une date d'abandon,
  alors le projet retourné devrait avoir le statut "Abandonné"`, async () => {
    const abandonedOn = new Date('2021-01-01').getTime();
    const fakeProject = makeFakeProject({ id: projectId, classe: 'Classé', abandonedOn });
    await Project.create(fakeProject);
    const fakeUser = { role: 'porteur-projet' } as User;

    const res = await getProjectEvents({ projectId, user: fakeUser });

    expect(res._unsafeUnwrap()).toMatchObject({
      project: {
        id: projectId,
        status: 'Abandonné',
      },
    });
  });
});
