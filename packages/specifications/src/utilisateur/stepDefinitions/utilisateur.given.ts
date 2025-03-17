import { Given as EtantDonné } from '@cucumber/cucumber';
import { match } from 'ts-pattern';

import { executeQuery, executeSelect } from '@potentiel-libraries/pg-helpers';
import { IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../potentiel.world';

import { inviterUtilisateur, retirerAccèsProjet } from './utilisateur.when';

EtantDonné('le porteur {string}', async function (this: PotentielWorld, porteurNom: string) {
  const porteur = this.utilisateurWorld.porteurFixture.créer({
    nom: porteurNom,
  });

  await insérerUtilisateur(porteur);
});

/** @deprecated Ceci utilise la table legacy Users et UserProjects */
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
      .with(
        'éliminé',
        () => this.eliminéWorld.rechercherÉliminéFixture(nomProjet).identifiantProjet,
      )
      .exhaustive();

    const porteur = this.utilisateurWorld.porteurFixture.créer({
      nom: porteurNom,
    });

    await insérerUtilisateur(porteur);

    const projets = await récupérerProjets(identifiantProjet);

    await associerProjetAuPorteur(porteur.id, projets);
  },
);
EtantDonné(
  'la dreal {string} associée à la région du projet',
  async function (this: PotentielWorld, drealNom: string) {
    const { région } = this.candidatureWorld.importerCandidature.values.localitéValue;
    const dreal = this.utilisateurWorld.drealFixture.créer({
      nom: drealNom,
      région,
    });

    await inviterUtilisateur.call(this, {
      rôle: dreal.role,
      région: dreal.région,
    });

    // Compatibilité Legacy
    await insérerUtilisateur(dreal);
    await associerUtilisateurÀSaDreal(dreal.id, région);
  },
);

EtantDonné(
  'le DGEC Validateur sans fonction {string}',
  async function (this: PotentielWorld, nom: string) {
    const validateur = this.utilisateurWorld.validateurFixture.créer({
      nom,
      fonction: undefined,
    });

    await insérerUtilisateur(validateur);
  },
);

EtantDonné('le DGEC Validateur sans nom', async function (this: PotentielWorld) {
  const validateur = this.utilisateurWorld.validateurFixture.créer({
    nom: '',
  });

  await insérerUtilisateur(validateur);
});

EtantDonné(
  `l'accès retiré au projet {lauréat-éliminé}`,
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    const { identifiantProjet } =
      statutProjet === 'lauréat' ? this.lauréatWorld : this.eliminéWorld;

    await retirerAccèsProjet.call(this, {
      identifiantProjet: identifiantProjet.formatter(),
      identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
    });
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

async function insérerUtilisateur({
  id,
  nom,
  email,
  role,
}: {
  id: string;
  nom: string;
  email: string;
  role: string;
}) {
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
    id,
    nom,
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

  await inviterUtilisateur.call(this, {
    rôle: validateur.role,
    email: validateur.email,
    fonction: validateur.fonction,
    nomComplet: validateur.nom,
  });
  await inviterUtilisateur.call(this, { rôle: system.role, email: system.email });
  await inviterUtilisateur.call(this, { rôle: admin.role, email: admin.email });

  await insérerUtilisateur(validateur);
  await insérerUtilisateur(system);
  await insérerUtilisateur(admin);
}

export async function insérerPorteurCandidature(this: PotentielWorld) {
  const {
    values: { emailContactValue },
    identifiantProjet,
  } = this.candidatureWorld.importerCandidature;

  const porteur = this.utilisateurWorld.porteurFixture.créer({ email: emailContactValue });
  await insérerUtilisateur(porteur);

  const projets = await récupérerProjets(IdentifiantProjet.convertirEnValueType(identifiantProjet));

  await associerProjetAuPorteur(porteur.id, projets);
}
