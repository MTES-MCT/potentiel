import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';

Quand(
  'le porteur demande le changement de puissance pour le projet {lauréat-éliminé} avec :',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé', dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const { ratioPuissance } = this.lauréatWorld.puissanceWorld.mapExempleToFixtureValues(
      exemple,
      this.candidatureWorld.importerCandidature.dépôtValue.puissanceProductionAnnuelle,
    );

    try {
      await demanderChangementPuissance.call(this, statutProjet, ratioPuissance);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur enregistre un changement de puissance pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();
    const { ratioPuissance, puissanceDeSite } =
      this.lauréatWorld.puissanceWorld.mapExempleToFixtureValues(
        exemple,
        this.candidatureWorld.importerCandidature.dépôtValue.puissanceProductionAnnuelle,
      );

    try {
      await enregistrerChangementPuissance.call(this, ratioPuissance, puissanceDeSite);
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
  'la DREAL associée au projet accorde le changement de puissance pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await accorderChangementPuissance.call(this);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'la DREAL associée au projet rejette le changement de puissance pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await rejeterChangementPuissance.call(this);
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

  const { pièceJustificative, demandéLe, demandéPar, raison, ratioPuissance } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.demanderChangementPuissanceFixture.créer(
      {
        demandéPar: this.utilisateurWorld.porteurFixture.email,
        ratioPuissance: ratioValue,
      },
    );

  const puissanceValue =
    ratioPuissance *
    this.candidatureWorld.importerCandidature.values.puissanceProductionAnnuelleValue;

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
  ratioPuissanceValue?: number,
  puissanceDeSiteValue?: number,
) {
  const { identifiantProjet } = this.lauréatWorld;

  const { pièceJustificative, demandéLe, demandéPar, raison, ratioPuissance, puissanceDeSite } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.enregistrerChangementPuissanceFixture.créer(
      {
        demandéPar: this.utilisateurWorld.porteurFixture.email,
        ...(ratioPuissanceValue !== undefined && { ratioPuissance: ratioPuissanceValue }),
        ...(puissanceDeSiteValue !== undefined && {
          puissanceDeSite: puissanceDeSiteValue,
        }),
      },
    );

  await mediator.send<Lauréat.Puissance.EnregistrerChangementPuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.EnregistrerChangement',
    data: {
      raisonValue: raison,
      puissanceValue:
        ratioPuissance *
        this.candidatureWorld.importerCandidature.dépôtValue.puissanceProductionAnnuelle,
      puissanceDeSiteValue: puissanceDeSite,
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

export async function accorderChangementPuissance(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { accordéeLe, accordéePar, réponseSignée, estUneDécisionDEtat } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.accorderChangementPuissanceFixture.créer(
      {
        accordéePar: this.utilisateurWorld.drealFixture.email,
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
      estUneDécisionDEtatValue: estUneDécisionDEtat,
    },
  });
}

export async function rejeterChangementPuissance(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { rejetéeLe, rejetéePar, réponseSignée, estUneDécisionDEtat } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.rejeterChangementPuissanceFixture.créer(
      {
        rejetéePar: this.utilisateurWorld.drealFixture.email,
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
      estUneDécisionDEtatValue: estUneDécisionDEtat,
    },
  });
}
