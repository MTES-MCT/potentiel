import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world.js';

Quand(
  /(le DGEC validateur|la DREAL associée au projet) modifie l'actionnaire pour le projet (lauréat|éliminé)/,
  async function (
    this: PotentielWorld,
    rôle: 'le DGEC validateur' | 'la DREAL associée au projet',
    statutProjet: 'lauréat' | 'éliminé',
  ) {
    try {
      const { email } = match(rôle)
        .with('le DGEC validateur', () => this.utilisateurWorld.adminFixture)
        .with('la DREAL associée au projet', () => this.utilisateurWorld.drealFixture)
        .exhaustive();
      await modifierActionnaire.call(this, email, statutProjet);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur enregistre un changement d'actionnaire pour le projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await enregistrerChangementActionnaire.call(
        this,
        this.utilisateurWorld.porteurFixture.email,
        statutProjet,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur enregistre un changement d'actionnaire avec la même valeur pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await enregistrerChangementActionnaire.call(
        this,
        this.utilisateurWorld.porteurFixture.email,
        'lauréat',
        this.candidatureWorld.importerCandidature.values.sociétéMèreValue,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le DGEC validateur modifie l'actionnaire avec la même valeur pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaireSansChangement.call(this, this.utilisateurWorld.adminFixture.email);
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
        this.candidatureWorld.importerCandidature.values.sociétéMèreValue,
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
      await annulerChangementActionnaire.call(this);
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
      : this.éliminéWorld.identifiantProjet.formatter();

  const { pièceJustificative, demandéLe, demandéPar, raison, actionnaire } =
    this.lauréatWorld.actionnaireWorld.demanderChangementActionnaireFixture.créer({
      demandéPar: utilisateur,
      ...(actionnaireValue && { actionnaire: actionnaireValue }),
    });

  await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.DemanderChangement',
    data: {
      raisonValue: raison,
      actionnaireValue: actionnaireValue ?? actionnaire,
      dateDemandeValue: demandéLe,
      identifiantUtilisateurValue: demandéPar,
      identifiantProjetValue: identifiantProjet,
      pièceJustificativeValue: pièceJustificative,
    },
  });
}

export async function annulerChangementActionnaire(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { annuléeLe, annuléePar } =
    this.lauréatWorld.actionnaireWorld.annulerChangementActionnaireFixture.créer({
      annuléePar: this.utilisateurWorld.porteurFixture.email,
    });

  await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
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
  const { réponseSignée, accordéeLe, accordéePar } =
    this.lauréatWorld.actionnaireWorld.accorderChangementActionnaireFixture.créer({
      accordéePar: utilisateur,
    });

  await mediator.send<Lauréat.Actionnaire.AccorderChangementActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.AccorderDemandeChangement',
    data: {
      accordéLeValue: accordéeLe,
      accordéParValue: accordéePar,
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: réponseSignée,
    },
  });
}

export async function rejeterChangementActionnaire(this: PotentielWorld, utilisateur?: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { rejetéeLe, rejetéePar, réponseSignée } =
    this.lauréatWorld.actionnaireWorld.rejeterChangementActionnaireFixture.créer({
      rejetéePar: utilisateur,
    });

  await mediator.send<Lauréat.Actionnaire.RejeterChangementActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.RejeterDemandeChangement',
    data: {
      rejetéLeValue: rejetéeLe,
      rejetéParValue: rejetéePar,
      réponseSignéeValue: réponseSignée,
      identifiantProjetValue: identifiantProjet,
    },
  });
}

async function modifierActionnaire(
  this: PotentielWorld,
  modifiéPar: string,
  statutProjet?: 'lauréat' | 'éliminé',
) {
  const { identifiantProjet } = statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

  const { actionnaire, dateModification, raison } =
    this.lauréatWorld.actionnaireWorld.modifierActionnaireFixture.créer();

  await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: actionnaire,
      dateModificationValue: dateModification,
      raisonValue: raison,
    },
  });
}

async function modifierActionnaireSansChangement(this: PotentielWorld, modifiéPar: string) {
  const actionnaire = this.candidatureWorld.importerCandidature.values.sociétéMèreValue;

  const { dateModification, raison } =
    this.lauréatWorld.actionnaireWorld.modifierActionnaireFixture.créer({
      actionnaire,
    });

  await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: this.lauréatWorld.identifiantProjet.formatter(),
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: actionnaire,
      dateModificationValue: dateModification,
      raisonValue: raison,
    },
  });
}

async function enregistrerChangementActionnaire(
  this: PotentielWorld,
  demandéPar: string,
  statutProjet?: 'lauréat' | 'éliminé',
  nouvelActionnaire?: string,
) {
  const { identifiantProjet } = statutProjet === 'éliminé' ? this.éliminéWorld : this.lauréatWorld;

  const { pièceJustificative, demandéLe, raison, actionnaire } =
    this.lauréatWorld.actionnaireWorld.enregistrerChangementActionnaireFixture.créer({
      demandéPar,
      ...(nouvelActionnaire && { actionnaire: nouvelActionnaire }),
    });

  await mediator.send<Lauréat.Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.EnregistrerChangement',
    data: {
      identifiantProjetValue: identifiantProjet.formatter(),
      identifiantUtilisateurValue: demandéPar,
      actionnaireValue: actionnaire,
      dateChangementValue: demandéLe,
      pièceJustificativeValue: pièceJustificative,
      raisonValue: raison,
    },
  });
}
