import * as dotenv from 'dotenv';
dotenv.config();

import { RawIdentifiantProjet, convertirEnIdentifiantProjet } from '@potentiel/domain';
import { executeSelect } from '@potentiel/pg-helpers';
import { appelsOffreData } from '@potentiel/domain-inmemory-referential';
import { CahierDesChargesRéférence } from '@potentiel/domain-views';
import { isSome } from '@potentiel/monads';

(async () => {
  // 1 - Récupérer les identifiants naturels des projets ayant eu leur date de mise en service transmise
  const selectIdentifiantProjetQuery = `
      select json_build_object(
      'identifiantNaturelProjet', payload->>'identifiantProjet'
    ) as value
      from "EVENT_STREAM"
      where type = $1
    `;
  const identifiantsProjets = await executeSelect<{
    value: {
      identifiantNaturelProjet: RawIdentifiantProjet;
    };
  }>(selectIdentifiantProjetQuery, 'DateMiseEnServiceTransmise');

  if (!identifiantsProjets.length) {
    console.error(`❗️ Aucun projet n'a eu sa date de mise en service importée ❗️`);
    return;
  }

  let nombreProjetsPourLesquelsOnDoitRetirer18Mois = 0;
  let nombreProjetsPourLesquelsOnDoitEnleverleCDCModifié = 0;

  for (const {
    value: { identifiantNaturelProjet },
  } of identifiantsProjets) {
    const identifiantProjet = convertirEnIdentifiantProjet(identifiantNaturelProjet);

    // 2 - récupérer le legacyId + cdc actuel du projet
    const selectDétailsProjetQuery = `
  select json_build_object(
    'legacyId', "id",
    'cahierDesChargesActuel', "cahierDesChargesActuel"
  ) as détails
  from "projects"
  where "appelOffreId" = $1 and "periodeId" = $2 and "familleId" = $3 and "numeroCRE" = $4
      `;

    const projetActuel = await executeSelect<{
      détails: {
        legacyId: string;
        cahierDesChargesActuel: CahierDesChargesRéférence;
      };
    }>(
      selectDétailsProjetQuery,
      identifiantProjet.appelOffre,
      identifiantProjet.période,
      isSome(identifiantProjet.famille) ? identifiantProjet.famille : '',
      identifiantProjet.numéroCRE,
    );

    if (projetActuel.length === 0) {
      console.error(`❗️ Projet actuel (${identifiantNaturelProjet}) non trouvé`);
      continue;
    }

    // 3 - On passe à la suite si le projet n'a pas comme cdc actuel le cdc modifié au 30/08/2022 car il n'est pas concerné
    if (
      projetActuel[0].détails.cahierDesChargesActuel !== '30/08/2022' &&
      projetActuel[0].détails.cahierDesChargesActuel !== '30/08/2022-alternatif'
    ) {
      continue;
    }

    const appelOffre = appelsOffreData.find((ao) => ao.id === identifiantProjet.appelOffre);

    if (!appelOffre) {
      continue;
    }

    const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);

    if (!période) {
      continue;
    }

    const CDCModifiéDisponiblePourPériode = période.cahiersDesChargesModifiésDisponibles.filter(
      (cdc) => cdc.paruLe === '30/08/2022',
    );

    if (CDCModifiéDisponiblePourPériode.length === 0) {
      // le projet a un CDC modifié en 2022 alors qu'il ne devrait pas car sa période ne le permet pas, on devrait donc lui changer son CDC
      nombreProjetsPourLesquelsOnDoitEnleverleCDCModifié += 1;
      continue;
    }

    for (const cahierDesCharges of CDCModifiéDisponiblePourPériode) {
      // si le projet a bien le CDC modifié mais que celui-ci ne permet pas les 18 mois,  alors on doit lui supprimer les 18 mois
      if (!cahierDesCharges.délaiApplicable) {
        nombreProjetsPourLesquelsOnDoitRetirer18Mois += 1;
      }
    }
  }

  console.log(
    'Nombre total de projets ayant transmis une date de mise en service pour lequels on doit enlever le CDC modifié : ',
    nombreProjetsPourLesquelsOnDoitEnleverleCDCModifié,
  );
  console.log(
    'Nombre total de projets ayant transmis une date de mise en service pour lequels on doit retirer les 18 mois ',
    nombreProjetsPourLesquelsOnDoitRetirer18Mois,
  );
})();
