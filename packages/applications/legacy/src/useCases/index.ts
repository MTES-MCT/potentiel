import makeShouldUserAccessProject from './shouldUserAccessProject';

const shouldUserAccessProject = makeShouldUserAccessProject().check;

const useCases = Object.freeze({
  shouldUserAccessProject,
});

export default useCases;
export { shouldUserAccessProject };
