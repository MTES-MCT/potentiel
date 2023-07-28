import { QueryTypes } from 'sequelize';
import { sequelizeInstance } from '../sequelize.config';
import { UnauthorizedError } from '@modules/shared';
import { choisirCahierDesCharges } from '@config';
import {
  CahierDesChargesInitialNonDisponibleError,
  CahierDesChargesNonDisponibleError,
  NouveauCahierDesChargesDéjàSouscrit,
  PasDeChangementDeCDCPourCetAOError,
} from '@modules/project';

import { User } from '@entities';

async function changerCahierDesCharges(projetId: string) {
  const utilisateur: User = {
    role: 'admin',
    id: 'potentiel',
    email: 'contact@potentiel.fr',
    fullName: 'maintenance Potentiel',
  };

  await choisirCahierDesCharges({
    projetId,
    utilisateur,
    cahierDesCharges: { type: 'initial' },
  }).match(
    () => {},
    (error) => {
      if (error instanceof UnauthorizedError) {
        throw new Error('Impossible de changer le cahier des charges : utilisateur non autorisé');
      }

      if (
        error instanceof NouveauCahierDesChargesDéjàSouscrit ||
        error instanceof PasDeChangementDeCDCPourCetAOError ||
        error instanceof CahierDesChargesInitialNonDisponibleError ||
        error instanceof CahierDesChargesNonDisponibleError
      ) {
        throw new Error('Impossible de changer le cahier des charges', error);
      }
    },
  );
}

async function getProjectIds() {
  try {
    const projects: Array<{ id: string }> = await sequelizeInstance.query(
      `
      SELECT "id"
      FROM "projects"
      WHERE "cahierDesChargesActuel" = '30/07/2021'
      AND ("appelOffreId" in ('PPE2 - Autoconsommation métropole', 'PPE2 - Sol', 'PPE2 - Bâtiment' , 'Eolien')
      OR ("appelOffreId" =  'CRE4 - Bâtiment' and "periodeId" =  '13'))
      `,
      { type: QueryTypes.SELECT },
    );

    return projects.map((project) => project.id);
  } catch (error) {
    throw new Error('Impossible de récupérer les identifiants projets');
  }
}

async function main() {
  const projectIds = await getProjectIds();

  for (const projectId of projectIds) {
    await changerCahierDesCharges(projectId);
  }

  console.log('DONE ✨');
}

main();
