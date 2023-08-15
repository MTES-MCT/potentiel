import { wrapInfra } from '../../../../core/utils';
import { FindProjectByIdentifiers } from '../../../../modules/project';
import { Project } from "../../projectionsNext";

export const findProjectByIdentifiers: FindProjectByIdentifiers = (args) => {
  return wrapInfra(Project.findOne({ where: args })).map((rawItem: any) =>
    rawItem ? rawItem.get().id : null,
  );
};
