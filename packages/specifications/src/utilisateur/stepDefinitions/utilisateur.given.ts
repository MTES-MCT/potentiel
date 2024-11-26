import { Given as EtantDonné } from '@cucumber/cucumber';
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
  'la dreal {string} associée à la région du projet',
  async function (this: PotentielWorld, drealNom: string) {
    const { email, id, nom, role } = this.utilisateurWorld.drealFixture.créer({
      nom: drealNom,
    });

    await insérerUtilisateur(id, nom, email, role);

    const { région } = this.candidatureWorld.importerCandidature.values.localitéValue;

    await associerUtilisateurÀSaDreal(id, région);
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

async function associerUtilisateurÀSaDreal(userId: string, régionProjet: string) {
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
    régionProjet,
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

export async function initialiserUtilisateursTests(this: PotentielWorld) {
  const validateur = this.utilisateurWorld.validateurFixture.créer();
  const system = this.utilisateurWorld.systemFixture.créer();
  const admin = this.utilisateurWorld.adminFixture.créer();

  await insérerUtilisateur(validateur.id, validateur.nom, validateur.email, validateur.role);
  await insérerUtilisateur(system.id, system.nom, system.email, system.role);
  await insérerUtilisateur(admin.id, admin.nom, admin.email, admin.role);
}
