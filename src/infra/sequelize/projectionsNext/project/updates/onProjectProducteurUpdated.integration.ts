import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectProducteurUpdated } from './onProjectProducteurUpdated';
import { ProjectProducteurUpdated } from '@modules/project';
import { v4 as uuid } from 'uuid';
import { Project } from '@infra/sequelize/projectionsNext';

describe('project.onProjectProducteurUpdated', () => {
  const projectId = uuid();
  const project = makeFakeProject({ id: projectId, producteur: 'old producteur' });

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();
    await Project.bulkCreate([project]);
  });

  it('should update the project producteur', async () => {
    const newProducteur = 'new producteur';

    await onProjectProducteurUpdated(
      new ProjectProducteurUpdated({
        payload: { projectId, newProducteur, updatedBy: 'someone' },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.nomCandidat).toEqual(newProducteur);
  });
});
