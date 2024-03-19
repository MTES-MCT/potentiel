import { Entity } from "@potentiel-domain/core";
import { executeQuery } from "@potentiel/pg-helpers";
import { flatten } from "flat";

const insertQuery = "insert into domain_views.projection values($1, $2)";

export const createProjection = async <TProjection extends Entity>(
  id: `${TProjection["type"]}|${string}`,
  readModel: Omit<TProjection, "type">
): Promise<void> => {
  await executeQuery(insertQuery, id, flatten(readModel));
};
