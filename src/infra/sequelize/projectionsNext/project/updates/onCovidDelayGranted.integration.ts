import { resetDatabase } from '../../../helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onCovidDelayGranted } from './onCovidDelayGranted';
import { CovidDelayGranted } from '@modules/project';
import { v4 as uuid } from 'uuid';
import { Project } from '../project.model';

describe('project.onCovidDelayGranted', () => {
  const projectId = uuid();
  const project = makeFakeProject({ id: projectId, notifiedOn: 123 });

  beforeAll(async () => {
    // Create the tables and remove all data
    await resetDatabase();
    await Project.bulkCreate([project]);
  });

  it('should update the project completion due date', async () => {
    const newCompletionDueOn = 456;

    await onCovidDelayGranted(
      new CovidDelayGranted({
        payload: { projectId, completionDueOn: newCompletionDueOn },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject?.completionDueOn).toEqual(newCompletionDueOn);
  });
});
