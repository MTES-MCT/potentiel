import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onContratEnedisMisAJour } from './onContratEnedisMisAJour';
import { ContratEnedisMisAJour } from '@modules/enedis';
import { v4 as uuid } from 'uuid';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onContratEnedisMisAJour', () => {
  const projectId = uuid();
  const project = makeFakeProject({
    id: projectId,
    contratEnedis: {
      numero: '1234',
    },
  });

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();
    await Project.bulkCreate([project]);
  });

  it('should set the project contratEnedis', async () => {
    await onContratEnedisMisAJour(
      new ContratEnedisMisAJour({
        payload: {
          projectId,
          numero: '123',
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.contratEnedis).toMatchObject({
      numero: '123',
    });
  });
});
