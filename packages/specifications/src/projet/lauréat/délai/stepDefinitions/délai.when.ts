import { type DataTable, When as Quand } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { convertFixtureFileToReadableStream } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';
import type { CréerDemandeDélaiFixture } from '../fixtures/demanderDélai.fixture.js';

Quand('le porteur demande un délai pour le projet lauréat', async function (this: PotentielWorld) {
  await demanderDélai.call(this, {
    identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
  });
});

Quand(
  'le porteur demande un délai avec un motif identique à celui de la demande déjà en cours',
  async function (this: PotentielWorld) {
    const motifDemandeEnCours = this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes
      .keys()
      .next().value;
    if (!motifDemandeEnCours) {
      throw new Error(`Pas de première demande en cours !`);
    }
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif: motifDemandeEnCours,
    });
  },
);

Quand(
  'le porteur demande un délai pour le projet lauréat avec :',
  async function (this: PotentielWorld, table: DataTable) {
    const exemple = table.rowsHash();

    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      ...this.lauréatWorld.délaiWorld.mapExempleToFixtureValues(exemple),
    });
  },
);

Quand(
  'le porteur annule la demande de délai pour le projet lauréat',
  async function (this: PotentielWorld) {
    await annulerDemandeDélai.call(this);
  },
);

Quand('la DREAL rejette le délai pour le projet lauréat', async function (this: PotentielWorld) {
  await rejeterDemandeDélai.call(this);
});

Quand(
  'la {dreal-dgec} accorde la demande de délai pour le projet lauréat',
  async function (this: PotentielWorld, rôle: 'dreal' | 'dgec') {
    await accorderDemandeDélai.call(this, rôle);
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
  'le porteur corrige la demande de délai pour le projet lauréat',
  async function (this: PotentielWorld) {
    await corrigerDemandeDélai.call(this);
  },
);

Quand(
  'le porteur corrige la demande de délai pour le projet lauréat avec les mêmes valeurs',
  async function (this: PotentielWorld) {
    await corrigerDemandeDélai.call(this, true);
  },
);

export async function demanderDélai(
  this: PotentielWorld,
  partialFixture: Omit<CréerDemandeDélaiFixture, 'motif'> & {
    motif?: CréerDemandeDélaiFixture['motif'];
  },
) {
  const motif =
    partialFixture.motif ?? Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement.motif;

  const demandes = this.lauréatWorld.délaiWorld.demanderDélaiFixture.créer({
    ...partialFixture,
    motif,
  });

  const demande = demandes.demandes.get(
    Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(motif).formatter(),
  );
  if (!demande) {
    throw new Error('Erreur lors de la création de la fixture !');
  }

  try {
    await mediator.send<Lauréat.Délai.DemanderDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.DemanderDélai',
      data: {
        identifiantProjetValue: partialFixture.identifiantProjet,
        nombreDeMoisValue: demande.nombreDeMois,
        raisonValue: demande.raison,
        pièceJustificativeValue: convertFixtureFileToReadableStream(demande.pièceJustificative),
        dateDemandeValue: demande.demandéLe,
        identifiantUtilisateurValue: demande.demandéPar,
        motifValue: demande.motif,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function corrigerDemandeDélai(this: PotentielWorld, avecLesMêmesValeurs?: true) {
  try {
    const demande = this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes
      .values()
      .next().value;

    if (avecLesMêmesValeurs && !demande) {
      throw new Error('Demande actuelle non trouvée');
    }

    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { nombreDeMois, raison, pièceJustificative, corrigéeLe, corrigéePar } =
      this.lauréatWorld.délaiWorld.corrigerDemandeDélaiFixture.créer(
        avecLesMêmesValeurs
          ? {
              corrigéePar: this.utilisateurWorld.porteurFixture.email,
              nombreDeMois: demande!.nombreDeMois,
              raison: demande!.raison,
              // Quand un document n'est pas changé, on transmet undefined au usecase
              pièceJustificative: undefined,
            }
          : {
              corrigéePar: this.utilisateurWorld.porteurFixture.email,
              // dans le processus de correction, le use case attend que le format du nouveau document soit le même que l'original
              // ce edge case est peut-être à revoir...
              pièceJustificative: faker.potentiel.document(demande?.pièceJustificative?.format),
            },
      );

    await mediator.send<Lauréat.Délai.CorrigerDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.CorrigerDemandeDélai',
      data: {
        identifiantUtilisateurValue: corrigéePar,
        identifiantProjetValue: identifiantProjet,
        dateDemandeValue: demande?.demandéLe ?? DateTime.now().formatter(),
        dateCorrectionValue: corrigéeLe,
        nombreDeMoisValue: nombreDeMois,
        raisonValue: raison,
        pièceJustificativeValue: pièceJustificative
          ? convertFixtureFileToReadableStream(pièceJustificative)
          : undefined,
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
        dateDemandeValue:
          this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes.values().next().value
            ?.demandéLe ?? DateTime.now().formatter(),
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
        dateDemandeValue:
          this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes.values().next().value
            ?.demandéLe ?? DateTime.now().formatter(),
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
        réponseSignéeValue: convertFixtureFileToReadableStream(réponseSignée),
        identifiantProjetValue: identifiantProjet,
        rôleUtilisateurValue: Role.dreal.nom,
        dateDemandeValue:
          this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes.values().next().value
            ?.demandéLe ?? DateTime.now().formatter(),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function accorderDemandeDélai(this: PotentielWorld, rôle: Role.RawType) {
  try {
    const demande = this.lauréatWorld.délaiWorld.demanderDélaiFixture.demandes
      .values()
      .next().value;
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { accordéeLe, accordéePar, réponseSignée, nombreDeMois } =
      this.lauréatWorld.délaiWorld.accorderDemandeDélaiFixture.créer({
        nombreDeMois: demande?.nombreDeMois ?? faker.number.int({ min: 0, max: 24 }),
        dateAchèvementPrévisionnelActuelle:
          this.lauréatWorld.achèvementWorld.calculerDateAchèvementPrévisionnelFixture
            .dateAchèvementPrévisionnel,
        accordéePar: this.utilisateurWorld.récupérerEmailSelonRôle(rôle),
      });

    await mediator.send<Lauréat.Délai.AccorderDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.AccorderDemandeDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: accordéePar,
        dateAccordValue: accordéeLe,
        motifValue:
          demande?.motif ?? faker.helpers.arrayElement(Lauréat.Délai.MotifDemandeDélai.motifs),
        nombreDeMois,
        réponseSignéeValue: convertFixtureFileToReadableStream(réponseSignée),
        rôleUtilisateurValue: rôle,
        dateDemandeValue: demande?.demandéLe ?? DateTime.now().formatter(),
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}
