import { describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectPuissanceUpdated } from './onProjectPuissanceUpdated';
import { ProjectPuissanceUpdated } from '@modules/project';
import { v4 as uuid } from 'uuid';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectPuissanceUpdated', () => {
  const projectId = uuid();
  const project = makeFakeProject({ id: projectId, puissanceInitiale: 100, puissance: 100 });

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();
    await Project.bulkCreate([project]);
  });

  it('should update the project puissance', async () => {
    const newPuissance = 109;

    await onProjectPuissanceUpdated(
      new ProjectPuissanceUpdated({
        payload: { projectId, newPuissance, updatedBy: 'someone' },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.puissance).toEqual(newPuissance);
    expect(updatedProject?.puissanceInitiale).toEqual(100);
  });
});
