import { beforeAll, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectActionnaireUpdated } from './onProjectActionnaireUpdated';
import { ProjectActionnaireUpdated } from '../../../../../modules/project';
import { v4 as uuid } from 'uuid';
import { Project } from '../..';

describe('project.onProjectActionnaireUpdated', () => {
  const projectId = uuid();
  const project = makeFakeProject({ id: projectId, actionnaire: 'old actionnaire' });

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();
    await Project.bulkCreate([project]);
  });

  it('should update the project actionnaire', async () => {
    const newActionnaire = 'new actionnaire';

    await onProjectActionnaireUpdated(
      new ProjectActionnaireUpdated({
        payload: { projectId, newActionnaire, updatedBy: 'someone' },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.actionnaire).toEqual(newActionnaire);
  });
});
