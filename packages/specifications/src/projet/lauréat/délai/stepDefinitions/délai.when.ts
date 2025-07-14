import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { PotentielWorld } from '../../../../potentiel.world';
import { CréerDemandeDélaiFixture } from '../fixtures/demanderDélai.fixture';

Quand('le porteur demande un délai pour le projet lauréat', async function (this: PotentielWorld) {
  await demanderDélai.call(this, {
    identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
  });
});

Quand(
  'le porteur annule la demande de délai pour le projet lauréat',
  async function (this: PotentielWorld) {
    await annulerDemandeDélai.call(this);
  },
);

Quand(
  'la DREAL associée au projet rejette le délai pour le projet lauréat',
  async function (this: PotentielWorld) {
    await rejeterDemandeDélai.call(this);
  },
);

Quand(
  /(.*) passe en instruction la demande de délai pour le projet lauréat/,
  async function (this: PotentielWorld, _: string) {
    try {
      const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
      // const régionDreal = this.utilisateurWorld.drealFixture.région;

      // if (rôleUtilisateur === 'un nouvel administrateur') {
      //   this.utilisateurWorld.drealFixture.créer({
      //     région: régionDreal,
      //   });
      // }

      const { passéEnInstructionLe, passéEnInstructionPar } =
        this.lauréatWorld.délaiWorld.passerEnInstructionDemandeDélaiFixture.créer({
          passéEnInstructionPar: this.utilisateurWorld.récupérerEmailSelonRôle(Role.dreal.nom),
        });

      await mediator.send<Lauréat.Délai.PasserEnInstructionDemandeDélaiUseCase>({
        type: 'Lauréat.Délai.UseCase.PasserEnInstructionDemande',
        data: {
          identifiantProjetValue: identifiantProjet,
          identifiantUtilisateurValue: passéEnInstructionPar,
          datePassageEnInstructionValue: passéEnInstructionLe,
        },
      });
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function demanderDélai(
  this: PotentielWorld,
  partialFixture: CréerDemandeDélaiFixture,
) {
  const { nombreDeMois, raison, pièceJustificative, demandéLe, demandéPar } =
    this.lauréatWorld.délaiWorld.demanderDélaiFixture.créer({ ...partialFixture });

  try {
    await mediator.send<Lauréat.Délai.DemanderDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.DemanderDélai',
      data: {
        identifiantProjetValue: partialFixture.identifiantProjet,
        nombreDeMoisValue: nombreDeMois,
        raisonValue: raison,
        pièceJustificativeValue: pièceJustificative,
        dateDemandeValue: demandéLe,
        identifiantUtilisateurValue: demandéPar,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function annulerDemandeDélai(this: PotentielWorld) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { annuléeLe, annuléePar } = this.lauréatWorld.délaiWorld.annulerDélaiFixture.créer({
      annuléePar: this.utilisateurWorld.porteurFixture.email,
    });

    await mediator.send<Lauréat.Délai.AnnulerDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.AnnulerDemande',
      data: {
        dateAnnulationValue: annuléeLe,
        identifiantUtilisateurValue: annuléePar,
        identifiantProjetValue: identifiantProjet,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function rejeterDemandeDélai(this: PotentielWorld) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { rejetéeLe, rejetéePar, réponseSignée } =
      this.lauréatWorld.délaiWorld.rejeterDemandeDélaiFixture.créer();

    await mediator.send<Lauréat.Délai.RejeterDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.RejeterDemandeDélai',
      data: {
        dateRejetValue: rejetéeLe,
        identifiantUtilisateurValue: rejetéePar,
        réponseSignéeValue: réponseSignée,
        identifiantProjetValue: identifiantProjet,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
