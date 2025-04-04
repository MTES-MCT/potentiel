import { DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Puissance } from '@potentiel-domain/laureat';

import { PotentielWorld } from '../../../../../potentiel.world';

Quand(
  'le porteur demande le changement de puissance avec la même valeur pour le projet lauréat',
  async function (this: PotentielWorld) {
    try {
      await demanderChangementPuissance.call(this, 'lauréat', 1);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur demande le changement de puissance à la baisse pour le projet {lauréat-éliminé}',
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await demanderChangementPuissance.call(this, statutProjet, undefined);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur demande le changement de puissance à la hausse pour le projet lauréat',
  async function (this: PotentielWorld) {
    const ratioALaHausse = 1.5;
    try {
      await demanderChangementPuissance.call(this, 'lauréat', ratioALaHausse);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  'le porteur demande le changement de puissance pour le projet lauréat avec :',
  async function (this: PotentielWorld, dataTable: DataTable) {
    const exemple = dataTable.rowsHash();

    try {
      await demanderChangementPuissance.call(this, 'lauréat', Number(exemple['ratio puissance']));
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
  `la DREAL associée au projet accorde le changement de puissance à la baisse pour le projet lauréat`,
  async function (this: PotentielWorld) {
    try {
      await accorderChangementPuissance.call(this);
      console.log('😧🫠🫠🫠accord réussi');
    } catch (error) {
      console.log('😧🫠🫠🫠accord failed', error);
      this.error = error as Error;
    }
  },
);

export async function demanderChangementPuissance(
  this: PotentielWorld,
  statutProjet: 'lauréat' | 'éliminé',
  ratioValue?: number,
) {
  const identifiantProjet =
    statutProjet === 'lauréat'
      ? this.lauréatWorld.identifiantProjet
      : this.eliminéWorld.identifiantProjet;

  const { pièceJustificative, demandéLe, demandéPar, raison, ratio } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.demanderChangementPuissanceFixture.créer(
      {
        demandéPar: this.utilisateurWorld.porteurFixture.email,
        ...(ratioValue !== undefined && { ratio: ratioValue }),
      },
    );

  const puissanceValue =
    ratio * this.lauréatWorld.puissanceWorld.mapToExpected(identifiantProjet).puissance;

  await mediator.send<Puissance.PuissanceUseCase>({
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

export async function annulerChangementPuissance(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { annuléeLe, annuléePar } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.annulerChangementPuissanceFixture.créer(
      {
        annuléePar: this.utilisateurWorld.porteurFixture.email,
      },
    );

  await mediator.send<Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.AnnulerDemandeChangement',
    data: {
      dateAnnulationValue: annuléeLe,
      identifiantUtilisateurValue: annuléePar,
      identifiantProjetValue: identifiantProjet,
    },
  });
}

async function accorderChangementPuissance(this: PotentielWorld) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { accordéeLe, accordéePar, réponseSignée } =
    this.lauréatWorld.puissanceWorld.changementPuissanceWorld.accorderChangementPuissanceFixture.créer(
      {
        accordéePar: this.utilisateurWorld.drealFixture.email,
      },
    );

  await mediator.send<Puissance.PuissanceUseCase>({
    type: 'Lauréat.Puissance.UseCase.AccorderDemandeChangement',
    data: {
      identifiantProjetValue: identifiantProjet,
      accordéLeValue: accordéeLe,
      accordéParValue: accordéePar,
      réponseSignéeValue: {
        content: réponseSignée.content,
        format: réponseSignée.format,
      },
    },
  });
}
