import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onContratEnedisRapprochéAutomatiquement } from './onContratEnedisRapprochéAutomatiquement';
import { ContratEnedisRapprochéAutomatiquement } from '@modules/enedis';
import { v4 as uuid } from 'uuid';
import { Project } from '../project.model';

describe('project.onContratEnedisRapprochéAutomatiquement', () => {
  const projectId = uuid();
  const project = makeFakeProject({ id: projectId, puissanceInitiale: 100, puissance: 100 });

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();
    await Project.bulkCreate([project]);
  });

  it('should set the project contratEnedis', async () => {
    await onContratEnedisRapprochéAutomatiquement(
      new ContratEnedisRapprochéAutomatiquement({
        payload: {
          projectId,
          numero: '123',
          rawValues: {},
          score: 34,
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.contratEnedis).toMatchObject({
      numero: '123',
    });
  });
});
