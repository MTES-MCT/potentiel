import { When as Quand } from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';

import { convertFixtureFileToReadableStream } from '#helpers';
import type { PotentielWorld } from '../../../../potentiel.world.js';
import type { CréerDemandeDélaiFixture } from '../fixtures/demanderDélai.fixture.js';

Quand(
  'le porteur demande une {string} pour le projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await demanderDélai.call(this, {
      identifiantProjet: this.lauréatWorld.identifiantProjet.formatter(),
      motif: this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
    });
  },
);

Quand(
  'le porteur annule la demande de {string} du projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await annulerDemandeDélai.call(
      this,
      this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
    );
  },
);

Quand(
  'la DREAL rejette la demande de {string} pour le projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await rejeterDemandeDélai.call(
      this,
      this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
    );
  },
);

Quand(
  'la {dreal-dgec} accorde la demande de {string} pour le projet lauréat',
  async function (
    this: PotentielWorld,
    rôle: 'dreal' | 'dgec',
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await accorderDemandeDélai.call(this, {
      rôle,
      motif: this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
    });
  },
);

Quand(
  /(.*) passe en instruction la demande de {string} pour le projet lauréat/,
  async function (
    this: PotentielWorld,
    utilisateur: string,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await passerDemanderDélaiEnInstruction.call(
      this,
      this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
      utilisateur.includes('un nouvel utilisateur dreal') ? true : undefined,
    );
  },
);

Quand(
  'le porteur corrige la demande de {string} pour le projet lauréat',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await corrigerDemandeDélai.call(
      this,
      this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
    );
  },
);

Quand(
  'le porteur corrige la demande de {string} pour le projet lauréat avec les mêmes valeurs',
  async function (
    this: PotentielWorld,
    motif: "prolongation de délai d'achèvement" | "prolongation de phase d'essai",
  ) {
    await corrigerDemandeDélai.call(
      this,
      this.lauréatWorld.délaiWorld.getMotifFromLabel(motif).formatter(),
      true,
    );
  },
);

// viovio probablement factoriser le motif ?
export async function demanderDélai(
  this: PotentielWorld,
  partialFixture: CréerDemandeDélaiFixture,
) {
  const motif = partialFixture.motif;

  const demandes = this.lauréatWorld.délaiWorld.demanderDélaiFixture.créer({
    ...partialFixture,
    motif,
  });

  const demande = demandes.demandes.get(
    Lauréat.Délai.MotifDemandeDélai.convertirEnValueType(motif).formatter(),
  );

  if (!demande) {
    throw new Error('Erreur lors de la création de la fixture "demander délai"');
  }

  try {
    await mediator.send<Lauréat.Délai.DemanderDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.DemanderDélai',
      data: {
        identifiantProjetValue: partialFixture.identifiantProjet,
        nombreDeMoisValue: demande.nombreDeMois,
        raisonValue: demande.raison,
        pièceJustificativeValue: convertFixtureFileToReadableStream(demande.pièceJustificative),
        identifiantUtilisateurValue: demande.demandéPar,
        dateDemandeValue: demande.demandéLe,
        motifValue: demande.motif,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function corrigerDemandeDélai(
  this: PotentielWorld,
  motif: Lauréat.Délai.MotifDemandeDélai.RawType,
  avecLesMêmesValeurs?: true,
) {
  try {
    const demande = this.lauréatWorld.délaiWorld.demanderDélaiFixture.getDemande(motif);

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
              pièceJustificative: faker.potentiel.document(demande!.pièceJustificative?.format),
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

export async function annulerDemandeDélai(
  this: PotentielWorld,
  motif: Lauréat.Délai.MotifDemandeDélai.RawType,
) {
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
          this.lauréatWorld.délaiWorld.demanderDélaiFixture.getDemandeOrThrow(motif).demandéLe,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function passerDemanderDélaiEnInstruction(
  this: PotentielWorld,
  motif: Lauréat.Délai.MotifDemandeDélai.RawType,
  nouvelleDreal?: true,
) {
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
          this.lauréatWorld.délaiWorld.demanderDélaiFixture.getDemandeOrThrow(motif).demandéLe,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function rejeterDemandeDélai(
  this: PotentielWorld,
  motif: Lauréat.Délai.MotifDemandeDélai.RawType,
) {
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
          this.lauréatWorld.délaiWorld.demanderDélaiFixture.getDemandeOrThrow(motif).demandéLe,
      },
    });
  } catch (error) {
    this.error = error as Error;
  }
}

export async function accorderDemandeDélai(
  this: PotentielWorld,
  { motif, rôle }: { motif: Lauréat.Délai.MotifDemandeDélai.RawType; rôle: Role.RawType },
) {
  try {
    const demande = this.lauréatWorld.délaiWorld.demanderDélaiFixture.getDemandéLe(motif);
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const { accordéeLe, accordéePar, réponseSignée, nombreDeMois } =
      this.lauréatWorld.délaiWorld.accorderDemandeDélaiFixture.créer({
        nombreDeMois: demande.nombreDeMois,
        dateAchèvementPrévisionnelActuelle:
          this.lauréatWorld.achèvementWorld.dateAchèvementPrévisionnelCalculée,
        accordéePar: this.utilisateurWorld.récupérerEmailSelonRôle(rôle),
        motifDemande: motif,
      });

    await mediator.send<Lauréat.Délai.AccorderDemandeDélaiUseCase>({
      type: 'Lauréat.Délai.UseCase.AccorderDemandeDélai',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: accordéePar,
        dateAccordValue: accordéeLe,
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
