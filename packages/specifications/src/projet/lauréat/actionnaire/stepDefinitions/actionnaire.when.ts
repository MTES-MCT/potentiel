import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Actionnaire } from '@potentiel-domain/laureat';
import { Role } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../../../potentiel.world';

import { importerActionnaire } from './actionnaire.given';

Quand("l'actionnaire est importé pour le projet", async function (this: PotentielWorld) {
  try {
    await importerActionnaire.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(
  /(le DGEC validateur|la DREAL associée au projet|le porteur) modifie l'actionnaire pour le projet (lauréat|éliminé)/,
  async function (
    this: PotentielWorld,
    rôle: 'le DGEC validateur' | 'la DREAL associée au projet' | 'le porteur',
    statutProjet: 'lauréat' | 'éliminé',
  ) {
    try {
      const { email, role } = match(rôle)
        .with('le DGEC validateur', () => this.utilisateurWorld.adminFixture)
        .with('la DREAL associée au projet', () => this.utilisateurWorld.drealFixture)
        .with('le porteur', () => this.utilisateurWorld.porteurFixture)
        .exhaustive();
      await modifierActionnaire.call(this, email, role, statutProjet);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le DGEC validateur modifie l'actionnaire avec la même valeur pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaireSansChangement.call(
        this,
        this.utilisateurWorld.adminFixture.email,
        Role.dgecValidateur.nom,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur demande le changement de l'actionnaire pour le projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await demanderChangementActionnaire.call(
        this,
        statutProjet,
        this.utilisateurWorld.porteurFixture.email,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur demande le changement de l'actionnaire avec la même valeur pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await demanderChangementActionnaire.call(
        this,
        'lauréat',
        this.utilisateurWorld.porteurFixture.email,
        this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.actionnaire,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur annule la demande de changement de l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await annulerChangementActionnaire.call(this, this.utilisateurWorld.porteurFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await accorderChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "la DREAL associée au projet rejette le changement d'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await rejeterChangementActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function demanderChangementActionnaire(
  this: PotentielWorld,
  statutProjet: 'lauréat' | 'éliminé',
  utilisateur?: string,
  actionnaireValue?: string,
) {
  const identifiantProjet =
    statutProjet === 'lauréat'
      ? this.lauréatWorld.identifiantProjet.formatter()
      : this.eliminéWorld.identifiantProjet.formatter();

  const {
    pièceJustificative: { format, content },
    demandéLe,
    demandéPar,
    raison,
    actionnaire,
  } = this.lauréatWorld.actionnaireWorld.demanderChangementActionnaireFixture.créer({
    demandéPar: utilisateur,
    ...(actionnaireValue && { actionnaire: actionnaireValue }),
  });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.DemanderChangement',
    data: {
      raisonValue: raison,
      actionnaireValue: actionnaireValue ?? actionnaire,
      dateDemandeValue: demandéLe,
      identifiantUtilisateurValue: demandéPar,
      identifiantProjetValue: identifiantProjet,
      pièceJustificativeValue: {
        content,
        format,
      },
    },
  });
}

export async function annulerChangementActionnaire(this: PotentielWorld, utilisateur?: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { annuléeLe, annuléePar } =
    this.lauréatWorld.actionnaireWorld.annulerChangementActionnaireFixture.créer({
      annuléePar: utilisateur,
    });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.AnnulerDemandeChangement',
    data: {
      dateAnnulationValue: annuléeLe,
      identifiantUtilisateurValue: annuléePar,
      identifiantProjetValue: identifiantProjet,
    },
  });
}

export async function accorderChangementActionnaire(this: PotentielWorld, utilisateur?: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
  const {
    réponseSignée: { format, content },
    accordéeLe,
    accordéePar,
  } = this.lauréatWorld.actionnaireWorld.accorderChangementActionnaireFixture.créer({
    accordéePar: utilisateur,
  });

  this.lauréatWorld.actionnaireWorld.actionnaire =
    this.lauréatWorld.actionnaireWorld.demanderChangementActionnaireFixture.actionnaire;

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.AccorderChangement',
    data: {
      accordéeLeValue: accordéeLe,
      accordéeParValue: accordéePar,
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: {
        content,
        format,
      },
    },
  });
}

export async function rejeterChangementActionnaire(this: PotentielWorld, utilisateur?: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { rejetéeLe, rejetéePar, réponseSignée } =
    this.lauréatWorld.actionnaireWorld.rejeterChangementActionnaireFixture.créer({
      rejetéePar: utilisateur,
    });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.RejeterDemandeChangement',
    data: {
      rejetéeLeValue: rejetéeLe,
      rejetéeParValue: rejetéePar,
      réponseSignéeValue: réponseSignée,
      identifiantProjetValue: identifiantProjet,
    },
  });
}

async function modifierActionnaire(
  this: PotentielWorld,
  modifiéPar: string,
  rôle: string,
  statutProjet?: 'lauréat' | 'éliminé',
) {
  const identifiantProjet =
    statutProjet === 'éliminé'
      ? this.eliminéWorld.identifiantProjet.formatter()
      : this.lauréatWorld.identifiantProjet.formatter();

  const { actionnaire, dateModification, raison } =
    this.lauréatWorld.actionnaireWorld.modifierActionnaireFixture.créer();

  this.lauréatWorld.actionnaireWorld.actionnaire = actionnaire;

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: actionnaire,
      dateModificationValue: dateModification,
      rôleValue: rôle,
      raisonValue: raison,
    },
  });
}

async function modifierActionnaireSansChangement(
  this: PotentielWorld,
  modifiéPar: string,
  rôle: string,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { dateModification, raison } =
    this.lauréatWorld.actionnaireWorld.modifierActionnaireFixture.créer();

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.actionnaire,
      dateModificationValue: dateModification,
      rôleValue: rôle,
      raisonValue: raison,
    },
  });
}
