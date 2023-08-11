import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '@core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { getProjectAppelOffreId } from './getProjectAppelOffreId';
import { Project } from '@infra/sequelize/projectionsNext';

const projectId = new UniqueEntityID().toString();

describe('Sequelize getProjectAppelOffreId', () => {
  it('should return the appelOffreId', async () => {
    await resetDatabase();

    const appelOffreId = 'appelOffreId123';

    await Project.create(makeFakeProject({ id: projectId, appelOffreId }));

    expect((await getProjectAppelOffreId(projectId))._unsafeUnwrap()).toEqual(appelOffreId);
  });
});
