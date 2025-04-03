import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Actionnaire } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';

Quand("l'actionnaire est importé pour le projet", async function (this: PotentielWorld) {
  try {
    await importerActionnaire.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

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
        this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.actionnaire,
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
      : this.eliminéWorld.identifiantProjet.formatter();

  const { pièceJustificative, demandéLe, demandéPar, raison, actionnaire } =
    this.lauréatWorld.actionnaireWorld.demanderChangementActionnaireFixture.créer({
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
  const { réponseSignée, accordéeLe, accordéePar } =
    this.lauréatWorld.actionnaireWorld.accorderChangementActionnaireFixture.créer({
      accordéePar: utilisateur,
    });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.AccorderChangement',
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

  await mediator.send<Actionnaire.ActionnaireUseCase>({
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
  const identifiantProjet =
    statutProjet === 'éliminé'
      ? this.eliminéWorld.identifiantProjet.formatter()
      : this.lauréatWorld.identifiantProjet.formatter();

  const { actionnaire, dateModification, raison } =
    this.lauréatWorld.actionnaireWorld.modifierActionnaireFixture.créer();

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: actionnaire,
      dateModificationValue: dateModification,
      raisonValue: raison,
    },
  });
}

async function modifierActionnaireSansChangement(this: PotentielWorld, modifiéPar: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const actionnaire = this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.actionnaire;

  const { dateModification, raison } =
    this.lauréatWorld.actionnaireWorld.modifierActionnaireFixture.créer({
      actionnaire,
    });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
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
  const identifiantProjet =
    statutProjet === 'éliminé'
      ? this.eliminéWorld.identifiantProjet.formatter()
      : this.lauréatWorld.identifiantProjet.formatter();

  const { pièceJustificative, demandéLe, raison, actionnaire } =
    this.lauréatWorld.actionnaireWorld.enregistrerChangementActionnaireFixture.créer({
      demandéPar,
      ...(nouvelActionnaire && { actionnaire: nouvelActionnaire }),
    });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.EnregistrerChangement',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: demandéPar,
      actionnaireValue: actionnaire,
      dateChangementValue: demandéLe,
      pièceJustificativeValue: pièceJustificative,
      raisonValue: raison,
    },
  });
}

async function importerActionnaire(this: PotentielWorld) {
  const identifiantProjet = this.candidatureWorld.importerCandidature.identifiantProjet;
  const { importéLe } = this.lauréatWorld.actionnaireWorld.importerActionnaireFixture;

  await mediator.send<Actionnaire.ActionnaireCommand>({
    type: 'Lauréat.Actionnaire.Command.ImporterActionnaire',
    data: {
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      importéLe: DateTime.convertirEnValueType(importéLe),
    },
  });
}
