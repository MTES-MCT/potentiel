import { Given as EtantDonné } from '@cucumber/cucumber';
import { match } from 'ts-pattern';

import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { Role, UtilisateurInvitéEvent, Zone } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../potentiel.world';
import { waitForSagasNotificationsAndProjectionsToFinish } from '../../helpers/waitForSagasNotificationsAndProjectionsToFinish';

import { désactiverUtilisateur, inviterPorteur, inviterUtilisateur } from './utilisateur.when';

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
      email: dreal.email,
    });
  },
);

EtantDonné(
  /le DGEC Validateur sans (.*)/,
  async function (this: PotentielWorld, informationManquante: string) {
    const validateur = this.utilisateurWorld.validateurFixture.créer(
      informationManquante === 'nom' ? { nom: '' } : { fonction: undefined },
    );

    const event: UtilisateurInvitéEvent = {
      type: 'UtilisateurInvité-V1',
      payload: {
        fonction: validateur.fonction,
        identifiantUtilisateur: validateur.email,
        invitéLe: DateTime.now().formatter(),
        invitéPar: Email.système.formatter(),
        nomComplet: validateur.nom,
        rôle: 'dgec-validateur',
      },
    };
    await publish(`utilisateur|${validateur.email}`, event);
  },
);

EtantDonné(
  'un utilisateur invité avec le rôle {string}',
  async function (this: PotentielWorld, rôle: string) {
    const payload = getPayloadForRôle.call(this, rôle);
    await inviterUtilisateur.call(this, payload);
  },
);

EtantDonné(
  'un utilisateur désactivé avec le rôle {string}',
  async function (this: PotentielWorld, rôle: string) {
    const payload = getPayloadForRôle.call(this, rôle);
    await inviterUtilisateur.call(this, payload);
    await waitForSagasNotificationsAndProjectionsToFinish();
    await désactiverUtilisateur.call(this, {
      identifiantUtilisateur: this.utilisateurWorld.inviterUtilisateur.email,
    });
  },
);

EtantDonné('le porteur du projet désactivé', async function (this: PotentielWorld) {
  await désactiverUtilisateur.call(this, {
    identifiantUtilisateur: this.utilisateurWorld.porteurFixture.email,
  });
});

EtantDonné(
  'un porteur invité sur le projet {lauréat-éliminé} {string}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', nomProjet: string) {
    const { identifiantProjet } =
      statutProjet === 'lauréat'
        ? this.lauréatWorld.rechercherLauréatFixture(nomProjet)
        : this.éliminéWorld.rechercherÉliminéFixture(nomProjet);

    const porteur = this.utilisateurWorld.porteurFixture.créer();

    await inviterPorteur.call(this, {
      identifiantsProjet: [identifiantProjet.formatter()],
      identifiantUtilisateur: porteur.email,
    });
  },
);

export async function initialiserUtilisateursTests(this: PotentielWorld) {
  const validateur = this.utilisateurWorld.validateurFixture.créer();
  const admin = this.utilisateurWorld.adminFixture.créer({});
  const cre = this.utilisateurWorld.creFixture.créer();

  await inviterUtilisateur.call(this, {
    rôle: validateur.role,
    email: validateur.email,
    fonction: validateur.fonction,
    nomComplet: validateur.nom,
  });
  await inviterUtilisateur.call(this, { rôle: admin.role, email: admin.email });
  await inviterUtilisateur.call(this, { rôle: cre.role, email: cre.email });
}

export function getPayloadForRôle(this: PotentielWorld, rôle: string) {
  return match(rôle)
    .with(Role.dgecValidateur.nom, () => ({
      rôle,
      fonction: 'Fonction du DGEC Validateur',
      nomComplet: 'Nom du DGEC Validateur',
    }))
    .with(Role.dreal.nom, () => ({
      rôle,
      région: this.candidatureWorld.importerCandidature.values.localitéValue.région,
    }))
    .with(Role.grd.nom, () => ({
      rôle,
      identifiantGestionnaireRéseau: this.raccordementWorld.identifiantGestionnaireRéseau,
    }))
    .with(Role.cocontractant.nom, () => ({
      rôle,
      zone: Zone.déterminer(this.candidatureWorld.importerCandidature.values.localitéValue.région)
        .nom,
    }))
    .otherwise(() => ({ rôle }));
}
