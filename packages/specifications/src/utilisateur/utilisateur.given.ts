import { Given as EtantDonné } from '@cucumber/cucumber';
import { executeQuery } from '@potentiel/pg-helpers';
import { randomUUID } from 'crypto';
import { PotentielWorld } from '../potentiel.world';

EtantDonné('un utilisateur admin {string}', async function (this: PotentielWorld, email: string) {
  await executeQuery(
    `
      insert into "users" (
        "id",
        "email",
        "role",
        "fullName"
      )
      values (
        $1,
        $2,
        $3,
        $4
      )
    `,
    randomUUID(),
    email,
    'admin',
    'nom admin',
  );
});
