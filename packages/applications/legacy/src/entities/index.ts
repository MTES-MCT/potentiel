import { v4 as uuidv4 } from 'uuid';
import buildMakeProject, { buildApplyProjectUpdate } from './project';
import buildMakeUser from './user';

const makeId = uuidv4;

const makeUser = buildMakeUser({ makeId });
const makeProject = buildMakeProject({ makeId });
const applyProjectUpdate = buildApplyProjectUpdate(makeId);

export * from './appelOffre';
export * from './periode';
export * from './project';
export * from './user';
export * from './cahierDesCharges';
export { makeUser, makeProject, applyProjectUpdate };
