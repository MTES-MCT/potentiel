import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';
import { UtilisateurWorld } from '../../../../../utilisateur/utilisateur.world';

Quand(
  'le porteur demande le changement de puissance pour le projet {lauréat-éliminé} avec :',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const ratio =
      exemple['nouvelle puissance'] !== undefined
        ? Number(exemple['nouvelle puissance']) /
          this.candidatureWorld.importerCandidature.values.puissanceProductionAnnuelleValue
        : Number(exemple['ratio puissance']);

    try {
      await demanderChangementPuissance.call(this, statutProjet, ratio);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur enregistre un changement de puissance pour le projet {lauréat-éliminé} avec :',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const ratio =
      exemple['nouvelle puissance'] !== undefined
        ? Number(exemple['nouvelle puissance']) /
          this.candidatureWorld.importerCandidature.values.puissanceProductionAnnuelleValue
        : Number(exemple['ratio puissance']);

    try {
      await enregistrerChangementPuissance.call(this, statutProjet, ratio);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur annule la demande de changement de puissance pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await annulerChangementPuissance.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /(.*) accorde le changement de puissance pour le projet lauréat/,
  async function (
    this: PotentielWorld,
    rôle: 'la DREAL associée au projet' | 'le DGEC validateur',
  ) {
    try {
      await accorderChangementPuissance.call(
        this,
        rôle === 'la DREAL associée au projet'
          ? this.utilisateurWorld.drealFixture.role
          : this.utilisateurWorld.adminFixture.role,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  /(.*) rejette le changement de puissance pour le projet lauréat/,
  async function (
    this: PotentielWorld,
    rôle: 'la DREAL associée au projet' | 'le DGEC validateur',
  ) {
    try {
      await rejeterChangementPuissance.call(
        this,
        rôle === 'la DREAL associée au projet'
          ? this.utilisateurWorld.drealFixture.role
          : this.utilisateurWorld.adminFixture.role,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function demanderChangementPuissance(
  this: PotentielWorld,
  statutProjet: 'lauréat' | 'éliminé',
  ratioValue: number,
) {
  const { identifiantProjet } = statutProjet === 'lauréat' ? this.lauréatWorld : this.éliminéWorld;

  const { pièceJustificative, demandéLe, demandéPar, raison, ratio } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.demanderChangementPuissanceFixture.créer(
      {
        demandéPar: this.utilisateurWorld.porteurFixture.email,
        ratio: ratioValue,
      },
    );

  const puissanceValue =
    ratio * this.candidatureWorld.importerCandidature.values.puissanceProductionAnnuelleValue;

  await mediator.send<Lauréat.Puissance.DemanderChangementUseCase>({
    type: 'Lauréat.Puissance.UseCase.DemanderChangement',
    data: {
      raisonValue: raison,
      puissanceValue,
      dateDemandeValue: demandéLe,
      identifiantUtilisateurValue: demandéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      pièceJustificativeValue: pièceJustificative,
    },
  });
}

export async function enregistrerChangementPuissance(
  this: PotentielWorld,
  statutProjet: 'lauréat' | 'éliminé',
  ratioValue?: number,
) {
  const { identifiantProjet } = statutProjet === 'lauréat' ? this.lauréatWorld : this.éliminéWorld;

  const { pièceJustificative, demandéLe, demandéPar, raison, ratio } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.enregistrerChangementPuissanceFixture.créer(
      {
        demandéPar: this.utilisateurWorld.porteurFixture.email,
        ...(ratioValue !== undefined && { ratio: ratioValue }),
      },
    );

  const puissanceValue =
    ratio * this.candidatureWorld.importerCandidature.values.puissanceProductionAnnuelleValue;

  await mediator.send<Lauréat.Puissance.EnregistrerChangementPuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.EnregistrerChangement',
    data: {
      raisonValue: raison,
      puissanceValue,
      dateChangementValue: demandéLe,
      identifiantUtilisateurValue: demandéPar,
      identifiantProjetValue: identifiantProjet.formatter(),
      pièceJustificativeValue: pièceJustificative,
    },
  });
}

export async function annulerChangementPuissance(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { annuléeLe, annuléePar } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.annulerChangementPuissanceFixture.créer(
      {
        annuléePar: this.utilisateurWorld.porteurFixture.email,
      },
    );

  await mediator.send<Lauréat.Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.AnnulerDemandeChangement',
    data: {
      dateAnnulationValue: annuléeLe,
      identifiantUtilisateurValue: annuléePar,
      identifiantProjetValue: identifiantProjet,
    },
  });
}

export async function accorderChangementPuissance(
  this: PotentielWorld,
  rôleUtilisateurValue:
    | UtilisateurWorld['drealFixture']['role']
    | UtilisateurWorld['adminFixture']['role'],
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { accordéeLe, accordéePar, réponseSignée, estUneDécisionDEtat } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.accorderChangementPuissanceFixture.créer(
      {
        accordéePar:
          rôleUtilisateurValue === 'dreal'
            ? this.utilisateurWorld.drealFixture.email
            : this.utilisateurWorld.adminFixture.email,
      },
    );

  await mediator.send<Lauréat.Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.AccorderDemandeChangement',
    data: {
      identifiantProjetValue: identifiantProjet,
      accordéLeValue: accordéeLe,
      accordéParValue: accordéePar,
      réponseSignéeValue: {
        content: réponseSignée.content,
        format: réponseSignée.format,
      },
      rôleUtilisateurValue,
      estUneDécisionDEtatValue: estUneDécisionDEtat,
    },
  });
}

export async function rejeterChangementPuissance(
  this: PotentielWorld,
  rôleUtilisateurValue:
    | UtilisateurWorld['drealFixture']['role']
    | UtilisateurWorld['adminFixture']['role'],
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { rejetéeLe, rejetéePar, réponseSignée, estUneDécisionDEtat } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.rejeterChangementPuissanceFixture.créer(
      {
        rejetéePar:
          rôleUtilisateurValue === 'dreal'
            ? this.utilisateurWorld.drealFixture.email
            : this.utilisateurWorld.adminFixture.email,
      },
    );

  await mediator.send<Lauréat.Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.RejeterDemandeChangement',
    data: {
      identifiantProjetValue: identifiantProjet,
      rejetéLeValue: rejetéeLe,
      rejetéParValue: rejetéePar,
      réponseSignéeValue: {
        content: réponseSignée.content,
        format: réponseSignée.format,
      },
      rôleUtilisateurValue,
      estUneDécisionDEtatValue: estUneDécisionDEtat,
    },
  });
}
