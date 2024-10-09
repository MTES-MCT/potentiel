import { err } from 'neverthrow';
import { TransactionalRepository, UniqueEntityID } from '../../../core/domain';
import { ProjectRawDataCorrected } from '../events';
import { Project } from '../Project';
import { GetUserById } from '../../../config';

// This exists only to access Project repo from within the ssr=>legacy saga.
export const handleProjectRawDataCorrected =
  (deps: { projectRepo: TransactionalRepository<Project>; getUserById: GetUserById }) =>
  async (event: ProjectRawDataCorrected) => {
    const { projectRepo, getUserById } = deps;

    const { correctedBy, correctedData, projectId } = event.payload;
    return projectRepo.transaction(
      new UniqueEntityID(projectId || undefined),
      (project) =>
        getUserById(correctedBy).map((user) => {
          if (user) {
            return project.correctData(user, correctedData);
          }
          return err('no user found');
        }),
      {
        acceptNew: true,
      },
    );
  };
