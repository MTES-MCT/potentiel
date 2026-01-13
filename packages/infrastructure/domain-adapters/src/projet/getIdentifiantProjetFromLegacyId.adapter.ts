import { executeSelect } from '@potentiel-libraries/pg-helpers';

export const getIdentifiantProjetFromLegacyId = async (
  legacyId: string,
): Promise<string | undefined> => {
  const result = await executeSelect<{ identifiantProjet: string }>(
    `select format('%s#%s#%s#%s', "appelOffreId", "periodeId", "familleId", "numeroCRE") as "identifiantProjet"
    from projects
    where id = $1`,
    legacyId,
  );
  return result[0]?.identifiantProjet;
};
