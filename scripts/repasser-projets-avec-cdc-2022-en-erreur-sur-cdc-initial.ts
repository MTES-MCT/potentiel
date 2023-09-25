import dotenv from 'dotenv';
dotenv.config();

import { executeSelect } from '@potentiel/pg-helpers';

(async () => {
  // 1 - Récupérer les identifiants naturels des projets ayant eu leur date de mise en service transmise
  const selectIdentifiantProjetQuery = `
      select json_build_object(
      'legacyId', "id"
    ) as value
      from 
        "projects"
      where 
        "cahierDesChargesActuel" in ($1,$2)
      and "abandonedOn" = $3
      and "classe" = $4
    `;
  const projetsId = await executeSelect<{
    value: {
      legacyId: string;
    };
  }>(selectIdentifiantProjetQuery, '30/08/2022', '30/08/2022-alternatif', 0, 'Classé');

  console.log(projetsId.length);
})();
