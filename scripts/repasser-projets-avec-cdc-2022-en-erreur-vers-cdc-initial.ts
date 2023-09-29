import dotenv from 'dotenv';
dotenv.config();

import { executeSelect } from '@potentiel/pg-helpers';
import { appelsOffreData } from '@potentiel/domain-inmemory-referential';

(async () => {
  // 1 - Récupérer les identifiants naturels des projets ayant eu leur date de mise en service transmise
  const selectIdentifiantProjetQuery = `
      select json_build_object(
      'legacyId', "id",
      'appelOffreId', "appelOffreId",
      'periodeId', "periodeId"
    ) as value
      from 
        "projects"
      where 
        "cahierDesChargesActuel" in ($1,$2)
      and "abandonedOn" = $3
      and "classe" = $4
    `;
  const projets = await executeSelect<{
    value: {
      legacyId: string;
      appelOffreId: string;
      periodeId: string;
    };
  }>(selectIdentifiantProjetQuery, '30/08/2022', '30/08/2022-alternatif', 0, 'Classé');

  if (!projets.length) {
    console.log('Aucun projet lauréat et non abandonné sur le CDC 2022 ou sa version alternative');
    return;
  }

  const projetsEnErreur: Array<{ legacyId: string; appelOffreId: string; periodeId: string }> = [];

  for (const projet of projets) {
    const AO = appelsOffreData.find((ao) => ao.id === projet.value.appelOffreId);

    if (!AO) {
      continue;
    }

    const periode = AO.periodes.find((p) => p.id === projet.value.periodeId);

    if (!periode) {
      continue;
    }

    const cdc2022 = periode.cahiersDesChargesModifiésDisponibles?.find(
      (cdc) => cdc.paruLe === '30/08/2022',
    );

    // projet dans les règles, la période permet l'accès aux cdc 2022
    if (cdc2022) {
      continue;
    }

    projetsEnErreur.push({
      legacyId: projet.value.legacyId,
      appelOffreId: projet.value.appelOffreId,
      periodeId: projet.value.periodeId,
    });
  }

  if (!projetsEnErreur.length) {
    console.log("Aucun projet n'est en erreur");
    return;
  }

  for (const projetEnErreur of projetsEnErreur) {
    console.log(
      `projet (${projetEnErreur.legacyId} - AO ${projetEnErreur.appelOffreId} - période ${projetEnErreur.periodeId})`,
    );
  }
})();
