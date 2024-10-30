import { randomUUID } from 'crypto';

import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
import { match } from 'ts-pattern';

import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

EtantDonné(
  'le porteur {string} ayant accés au projet {lauréat-éliminé} {string}',
  async function (
    this: PotentielWorld,
    porteurNom: string,
    typeProjet: 'lauréat' | 'éliminé',
    nomProjet: string,
  ) {
    const identifiantProjet = match(typeProjet)
      .with(
        'lauréat',
        () => this.lauréatWorld.rechercherLauréatFixture(nomProjet).identifiantProjet,
      )
      .otherwise(() => this.eliminéWorld.rechercherÉliminéFixture(nomProjet).identifiantProjet);

    const { email, id, nom, role } = this.utilisateurWorld.porteurFixture.créer({
      nom: porteurNom,
    });

    await insérerUtilisateur(id, nom, email, role);

    const projets = await récupérerProjets(identifiantProjet);
    await associerProjetAuPorteur(id, projets);
  },
);

EtantDonné(
  'le DGEC validateur {string}',
  async function (this: PotentielWorld, nomValidateur: string) {
    const { email, id, nom, role } = this.utilisateurWorld.validateurFixture.créer({
      nom: nomValidateur,
    });

    await insérerUtilisateur(id, nom, email, role);
  },
);

EtantDonné(
  'la dreal {string} associée à la région du projet',
  async function (this: PotentielWorld, drealNom: string) {
    const { email, id, nom, role } = this.utilisateurWorld.drealFixture.créer({
      nom: drealNom,
    });

    await insérerUtilisateur(id, nom, email, role);

    await associerUtilisateurÀSaDreal(id);
  },
);

EtantDonné("l'admin {string}", async function (this: PotentielWorld, nomAdmin: string) {
  const { email, id, nom, role } = this.utilisateurWorld.adminFixture.créer({
    nom: nomAdmin,
  });

  await insérerUtilisateur(id, nom, email, role);
});

// TODO : deprecated
EtantDonné(
  'le porteur pour le projet {lauréat-éliminé} {string}',
  async function (
    this: PotentielWorld,
    statutProjet: 'lauréat' | 'éliminé',
    nomProjet: string,
    table: DataTable,
  ) {
    const exemple = table.rowsHash();
    const email = exemple['email'] ?? 'email';
    const fullName = exemple['nom'] ?? 'nom';
    const userId = randomUUID();
    const role = 'porteur-projet';

    this.utilisateurWorld.porteurFixture.créer({
      email,
      id: userId,
      nom: fullName,
    });

    const { identifiantProjet } =
      statutProjet === 'lauréat'
        ? this.lauréatWorld.rechercherLauréatFixture(nomProjet)
        : this.eliminéWorld.rechercherÉliminéFixture(nomProjet);

    const projets = await récupérerProjets(identifiantProjet);

    await insérerUtilisateur(userId, fullName, email, role);

    await associerProjetAuPorteur(userId, projets);
  },
);

async function récupérerProjets(identifiantProjet: IdentifiantProjet.ValueType) {
  return executeSelect<{
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
}

async function associerProjetAuPorteur(userId: string, projets: { id: string }[]) {
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
}

async function associerUtilisateurÀSaDreal(userId: string) {
  await executeQuery(
    `
      insert into "userDreals" (
        "dreal",
        "userId",
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
    'regionProjet',
    userId,
    new Date().toISOString(),
    new Date().toISOString(),
  );
}

async function insérerUtilisateur(userId: string, fullName: string, email: string, role: string) {
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
}
