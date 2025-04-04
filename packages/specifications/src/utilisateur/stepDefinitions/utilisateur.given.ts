import { Given as EtantDonné } from '@cucumber/cucumber';

import { DateTime, Email } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';
import { UtilisateurInvitéEvent } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../potentiel.world';

import { inviterUtilisateur, retirerAccèsProjet } from './utilisateur.when';

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
        invitéPar: Email.system().formatter(),
        nomComplet: validateur.nom,
        rôle: 'dgec-validateur',
      },
    };
    await publish(`utilisateur|${validateur.email}`, event);
  },
);

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

export async function initialiserUtilisateursTests(this: PotentielWorld) {
  const validateur = this.utilisateurWorld.validateurFixture.créer();
  const admin = this.utilisateurWorld.adminFixture.créer({
    email: process.env.DGEC_EMAIL,
  });

  await inviterUtilisateur.call(this, {
    rôle: validateur.role,
    email: validateur.email,
    fonction: validateur.fonction,
    nomComplet: validateur.nom,
  });
  await inviterUtilisateur.call(this, { rôle: admin.role, email: admin.email });
}
