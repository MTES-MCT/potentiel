import { projectRepo as OldProjectRepo, userRepo } from '../dataAccess';
import makeGetUserProject from './getUserProject';
import makeShouldUserAccessProject from './shouldUserAccessProject';

const shouldUserAccessProject = makeShouldUserAccessProject().check;

const getUserProject = makeGetUserProject({
  findProjectById: OldProjectRepo.findById,
  shouldUserAccessProject,
});

const useCases = Object.freeze({
  getUserProject,
  shouldUserAccessProject,
});

export default useCases;
export { getUserProject, shouldUserAccessProject };
