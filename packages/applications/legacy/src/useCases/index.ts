import { eventStore, fileRepo, sendNotification, projectRepo } from '../config';
import { projectRepo as OldProjectRepo, userRepo } from '../dataAccess';
import makeGetUserProject from './getUserProject';
import makeShouldUserAccessProject from './shouldUserAccessProject';

const shouldUserAccessProject = makeShouldUserAccessProject().check;

const getUserProject = makeGetUserProject({
  findProjectById: OldProjectRepo.findById,
  shouldUserAccessProject,
});

const useCases = Object.freeze({
  sendNotification,
  getUserProject,
  shouldUserAccessProject,
});

export default useCases;
export { sendNotification, getUserProject, shouldUserAccessProject };
