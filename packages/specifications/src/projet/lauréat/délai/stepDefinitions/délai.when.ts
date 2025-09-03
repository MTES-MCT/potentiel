import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { faker } from '@faker-js/faker';

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
  'la DREAL associée au projet accorde la demande de délai pour le projet lauréat',
  async function (this: PotentielWorld) {
    await accorderDemandeDélai.call(this);
  },
);

Quand(
  /(.*) passe en instruction la demande de délai pour le projet lauréat/,
  async function (this: PotentielWorld, utilisateur: string) {
    await passerDemanderDélaiEnInstruction.call(
      this,
      utilisateur.includes('un nouvel utilisateur dreal') ? true : undefined,
    );
  },
);

Quand(
  /le porteur corrige la demande de délai pour le projet lauréat/,
  async function (this: PotentielWorld) {
    await corrigerDemandeDélai.call(this);
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

export async function corrigerDemandeDélai(this: PotentielWorld) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { nombreDeMois, raison, pièceJustificative, corrigéeLe, corrigéePar } =
      this.lauréatWorld.délaiWorld.corrigerDemandeDélaiFixture.créer({
        corrigéePar: this.utilisateurWorld.porteurFixture.email,
      });

    const { demandéLe } = this.lauréatWorld.délaiWorld.demanderDélaiFixture.aÉtéCréé
      ? this.lauréatWorld.délaiWorld.demanderDélaiFixture
      : this.lauréatWorld.délaiWorld.demanderDélaiFixture.créer({ identifiantProjet });

    await mediator.send<Lauréat.Délai.CorrigerDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.CorrigerDemandeDélai',
      data: {
        identifiantUtilisateurValue: corrigéePar,
        identifiantProjetValue: identifiantProjet,
        dateDemandeValue: demandéLe,
        dateCorrectionValue: corrigéeLe,
        nombreDeMoisValue: nombreDeMois,
        raisonValue: raison,
        pièceJustificativeValue: pièceJustificative,
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

export async function passerDemanderDélaiEnInstruction(this: PotentielWorld, nouvelleDreal?: true) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
    const régionDreal = this.utilisateurWorld.drealFixture.région;

    if (nouvelleDreal) {
      this.utilisateurWorld.drealFixture.créer({
        région: régionDreal,
      });
    }

    const { passéeEnInstructionLe, passéeEnInstructionPar } =
      this.lauréatWorld.délaiWorld.passerEnInstructionDemandeDélaiFixture.créer({
        passéeEnInstructionPar: this.utilisateurWorld.récupérerEmailSelonRôle(Role.dreal.nom),
      });

    await mediator.send<Lauréat.Délai.PasserEnInstructionDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.PasserEnInstructionDemande',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: passéeEnInstructionPar,
        datePassageEnInstructionValue: passéeEnInstructionLe,
        rôleUtilisateurValue: Role.dreal.nom,
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
      this.lauréatWorld.délaiWorld.rejeterDemandeDélaiFixture.créer({
        rejetéePar: this.utilisateurWorld.récupérerEmailSelonRôle(Role.dreal.nom),
      });

    await mediator.send<Lauréat.Délai.RejeterDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.RejeterDemandeDélai',
      data: {
        dateRejetValue: rejetéeLe,
        identifiantUtilisateurValue: rejetéePar,
        réponseSignéeValue: réponseSignée,
        identifiantProjetValue: identifiantProjet,
        rôleUtilisateurValue: Role.dreal.nom,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function accorderDemandeDélai(this: PotentielWorld) {
  try {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { accordéeLe, accordéePar, réponseSignée, nombreDeMois } =
      this.lauréatWorld.délaiWorld.accorderDemandeDélaiFixture.créer({
        nombreDeMois:
          this.lauréatWorld.délaiWorld.demanderDélaiFixture.nombreDeMois ??
          faker.number.int({ min: 1, max: 100 }),
        dateAchèvementPrévisionnelActuelle:
          this.lauréatWorld.achèvementWorld.calculerDateAchèvementPrévisionnelFixture
            .dateAchèvementPrévisionnel,
        accordéePar: this.utilisateurWorld.récupérerEmailSelonRôle(Role.dreal.nom),
      });

    await mediator.send<Lauréat.Délai.AccorderDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.AccorderDemandeDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: accordéePar,
        dateAccordValue: accordéeLe,
        nombreDeMois,
        réponseSignéeValue: réponseSignée,
        rôleUtilisateurValue: Role.dreal.nom,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
