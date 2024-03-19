import { Entity } from "@potentiel-domain/core";
import { executeQuery } from "@potentiel/pg-helpers";
import { flatten } from "flat";

const upsertQuery =
  "insert into domain_views.projection values($1, $2) on conflict (key) do update set value=$2";

export const upsertProjection = async <TProjection extends Entity>(
  id: `${TProjection["type"]}|${string}`,
  readModel: Omit<TProjection, "type">
): Promise<void> => {
  await executeQuery(upsertQuery, id, flatten(readModel));
};
