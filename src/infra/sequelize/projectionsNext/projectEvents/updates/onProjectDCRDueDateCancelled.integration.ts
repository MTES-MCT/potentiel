import { UniqueEntityID } from '@core/domain';
import { ProjectDCRDueDateCancelled, ProjectDCRDueDateSet } from '@modules/project';
import { resetDatabase } from '../../../helpers';
import { ProjectEvent } from '@infra/sequelize/projectionsNext';
import onProjectDCRDueDateCancelled from './onProjectDCRDueDateCancelled';

describe('onProjectDCRDueDateCancelled', () => {
  const projectId = new UniqueEntityID().toString();
  const occurredAt = new Date('2021-11-27');
  const eventId = new UniqueEntityID().toString();

  beforeEach(async () => {
    await resetDatabase();
    await ProjectEvent.create({
      projectId,
      type: ProjectDCRDueDateSet.type,
      eventPublishedAt: occurredAt.getTime(),
      id: eventId,
      valueDate: occurredAt.getTime(),
    });
  });

  it('should remove the ProjectDCRDueDateSet event for this project', async () => {
    await onProjectDCRDueDateCancelled(
      new ProjectDCRDueDateCancelled({
        payload: {
          projectId,
        },
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const projectEvent = await ProjectEvent.findOne({
      where: { projectId, type: ProjectDCRDueDateSet.type },
    });

    expect(projectEvent).toBeNull();
  });
});
