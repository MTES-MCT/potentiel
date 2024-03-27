import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import { sleep } from '../../helpers/sleep';
import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';
import { randomUUID } from 'crypto';

EtantDonné(
  'le porteur pour le projet lauréat {string}',
  async function (this: PotentielWorld, nomProjet: string, table: DataTable) {
    const exemple = table.rowsHash();

    const email = exemple['email'] ?? 'email';
    const fullName = exemple['nom'] ?? 'nom';
    const role = exemple['role'] ?? 'role';

    const { identifiantProjet } = this.lauréatWorld.rechercherLauréatFixture(nomProjet);

    const projets = await executeSelect<{
      id: string;
    }>(
      `
    select "id" from "projects"
    where "appelOffreId" = $1
    and "periodeId" = $2
    and "familleId" = $3
    and "numeroCRE" = $4
  `,
      identifiantProjet.appelOffre,
      identifiantProjet.période,
      identifiantProjet.famille,
      identifiantProjet.numéroCRE,
    );

    const userId = randomUUID();

    await executeQuery(
      `
      insert into "users" (
        "id",
        "fullName",
        "email",
        "role",
        "createdAt",
        "updatedAt"
      )
      values (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
    `,
      userId,
      fullName,
      email,
      role,
      new Date().toISOString(),
      new Date().toISOString(),
    );

    await executeQuery(
      `
      insert into "UserProjects" (
        "userId",
        "projectId",
        "createdAt",
        "updatedAt"
      )
      values (
        $1,
        $2,
        $3,
        $4
      )
    `,
      userId,
      projets[0].id,
      new Date().toISOString(),
      new Date().toISOString(),
    );

    this.utilisateurWorld.porteur = email;

    await sleep(100);
  },
);
