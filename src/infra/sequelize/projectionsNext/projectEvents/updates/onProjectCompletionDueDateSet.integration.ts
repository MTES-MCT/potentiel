import { beforeEach, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '../../../helpers';
import { UniqueEntityID } from '../../../../../core/domain';
import {
  ProjectCompletionDueDateSet,
  ProjectCompletionDueDateSetPayload,
} from '../../../../../modules/project';
import { ProjectEvent } from '../..';
import onProjectCompletionDueDateSet from './onProjectCompletionDueDateSet';

describe('onProjectCompletionDueDateSet', () => {
  const projectId = new UniqueEntityID().toString();
  const completionDueOn = new Date('2024-01-01').getTime();
  const occurredAt = new Date('2022-01-01');

  beforeEach(async () => {
    await resetDatabase();
  });

  it(`Si la raison n'est pas 'ChoixCDCAnnuleDélaiCdc2022' ou 'DateMiseEnServiceAnnuleDélaiCdc2022' 
      Alors un nouveau project event devrait être ajouté`, async () => {
    await onProjectCompletionDueDateSet(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId,
          completionDueOn,
        } as ProjectCompletionDueDateSetPayload,
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } });
    expect(projectEvent).not.toBeNull();
    expect(projectEvent).toMatchObject({
      projectId,
      type: 'ProjectCompletionDueDateSet',
      eventPublishedAt: occurredAt.getTime(),
      valueDate: completionDueOn,
    });
  });

  it(`Si la raison est 'DateMiseEnServiceAnnuleDélaiCdc2022' 
      Alors le project event ProjectCompletionDueDateSet de raison "délaiCdc2022" devrait être supprimé`, async () => {
    // Event initial
    await onProjectCompletionDueDateSet(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId,
          completionDueOn,
          reason: 'délaiCdc2022',
        } as ProjectCompletionDueDateSetPayload,
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const eventInitial = await ProjectEvent.findOne({ where: { projectId } });
    expect(eventInitial).not.toBeNull();
    expect(eventInitial).toMatchObject({
      projectId,
      type: 'ProjectCompletionDueDateSet',
      eventPublishedAt: occurredAt.getTime(),
      valueDate: completionDueOn,
      payload: { reason: 'délaiCdc2022' },
    });

    // Nouvel event
    await onProjectCompletionDueDateSet(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId,
          completionDueOn,
          reason: 'DateMiseEnServiceAnnuleDélaiCdc2022',
        } as ProjectCompletionDueDateSetPayload,
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } });
    expect(projectEvent).toBeNull();
  });

  it(`Si la raison est 'ChoixCDCAnnuleDélaiCdc2022' 
      Alors le project event ProjectCompletionDueDateSet de raison "délaiCdc2022" devrait être supprimé`, async () => {
    // Event initial
    await onProjectCompletionDueDateSet(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId,
          completionDueOn,
          reason: 'délaiCdc2022',
        } as ProjectCompletionDueDateSetPayload,
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const eventInitial = await ProjectEvent.findOne({ where: { projectId } });
    expect(eventInitial).not.toBeNull();
    expect(eventInitial).toMatchObject({
      projectId,
      type: 'ProjectCompletionDueDateSet',
      eventPublishedAt: occurredAt.getTime(),
      valueDate: completionDueOn,
      payload: { reason: 'délaiCdc2022' },
    });

    // Nouvel event
    await onProjectCompletionDueDateSet(
      new ProjectCompletionDueDateSet({
        payload: {
          projectId,
          completionDueOn,
          reason: 'ChoixCDCAnnuleDélaiCdc2022',
        } as ProjectCompletionDueDateSetPayload,
        original: {
          version: 1,
          occurredAt,
        },
      }),
    );

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } });
    expect(projectEvent).toBeNull();
  });
});
