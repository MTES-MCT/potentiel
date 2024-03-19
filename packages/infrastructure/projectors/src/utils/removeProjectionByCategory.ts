import { Entity } from "@potentiel-domain/core";
import { executeQuery } from "@potentiel/pg-helpers";

const deleteQuery = "delete from domain_views.projection where key like $1";

export const removeProjectionByCategory = async <TProjection extends Entity>(
  category: `${TProjection["type"]}`
): Promise<void> => {
  await executeQuery(deleteQuery, `${category}|%`);
};
