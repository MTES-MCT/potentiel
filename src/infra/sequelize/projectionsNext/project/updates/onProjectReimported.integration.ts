import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { ProjectReimported } from '@modules/project';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectReimported } from './onProjectReimported';
import { UniqueEntityID } from '@core/domain';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectReimported', () => {
  const projectId = new UniqueEntityID().toString();

  const fakeProject = makeFakeProject({
    id: projectId,
    email: 'email',
    numeroCRE: 'numeroCRE',
    details: { param1: 'value1', param2: 'value2' },
  });
  delete fakeProject.potentielIdentifier;

  beforeAll(async () => {
    await resetDatabase();

    await Project.create(fakeProject);

    await onProjectReimported(
      new ProjectReimported({
        payload: {
          projectId: projectId,
          appelOffreId: '',
          periodeId: '',
          importId: '',
          data: {
            email: 'email2',
            details: {
              param2: 'value2bis',
            },
          },
        },
        original: {
          version: 1,
          occurredAt: new Date(1234),
        },
      }),
    );
  });

  it('should update the project with the delta', async () => {
    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject).not.toEqual(null);

    expect(updatedProject).toMatchObject({
      email: 'email2',
      numeroCRE: 'numeroCRE',
      details: {
        param1: 'value1',
        param2: 'value2bis',
      },
    });
  });
});
