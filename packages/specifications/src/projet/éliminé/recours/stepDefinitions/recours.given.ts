import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Éliminé } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../potentiel.world';

EtantDonné(
  /une demande de recours en cours pour le projet éliminé/,
  async function (this: PotentielWorld) {
    await créerDemandeRecours.call(this);
  },
);

EtantDonné(/un recours accordé pour le projet éliminé/, async function (this: PotentielWorld) {
  await créerDemandeRecours.call(this);
  await créerAccordRecours.call(this);
});

EtantDonné(/un recours rejeté pour le projet éliminé/, async function (this: PotentielWorld) {
  await créerDemandeRecours.call(this);
  await créerRejetRecours.call(this);
});

EtantDonné(
  `une demande de recours en instruction pour le projet éliminé`,
  async function (this: PotentielWorld) {
    await créerDemandeRecours.call(this);
    await passerDemandeRecoursEnInstruction.call(this);
  },
);

async function créerDemandeRecours(this: PotentielWorld) {
  const identifiantProjet = this.éliminéWorld.identifiantProjet.formatter();

  const { raison, demandéLe, demandéPar, pièceJustificative } =
    this.éliminéWorld.recoursWorld.demanderRecoursFixture.créer({
      demandéPar: this.utilisateurWorld.porteurFixture.email,
    });

  await mediator.send<Éliminé.Recours.RecoursUseCase>({
    type: 'Éliminé.Recours.UseCase.DemanderRecours',
    data: {
      identifiantProjetValue: identifiantProjet,
      pièceJustificativeValue: pièceJustificative,
      raisonValue: raison,
      dateDemandeValue: demandéLe,
      identifiantUtilisateurValue: demandéPar,
    },
  });
}

async function créerAccordRecours(this: PotentielWorld) {
  const identifiantProjet = this.éliminéWorld.identifiantProjet.formatter();

  const {
    accordéLe: accordéeLe,
    accordéPar: accordéePar,
    réponseSignée,
  } = this.éliminéWorld.recoursWorld.accorderRecoursFixture.créer({
    accordéPar: this.utilisateurWorld.validateurFixture.email,
  });

  this.lauréatWorld.notifier({
    identifiantProjet: this.éliminéWorld.identifiantProjet.formatter(),
    notifiéLe: accordéeLe,
    notifiéPar: accordéePar,
    localité: this.candidatureWorld.importerCandidature.dépôtValue.localité,
    nomProjet: this.candidatureWorld.importerCandidature.dépôtValue.nomProjet,
  });

  await mediator.send<Éliminé.Recours.RecoursUseCase>({
    type: 'Éliminé.Recours.UseCase.AccorderRecours',
    data: {
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: réponseSignée,
      dateAccordValue: accordéeLe,
      identifiantUtilisateurValue: accordéePar,
    },
  });
}

async function créerRejetRecours(this: PotentielWorld) {
  const identifiantProjet = this.éliminéWorld.identifiantProjet.formatter();
  const {
    rejetéLe: rejetéeLe,
    rejetéPar: rejetéePar,
    réponseSignée,
  } = this.éliminéWorld.recoursWorld.rejeterRecoursFixture.créer({
    rejetéPar: this.utilisateurWorld.validateurFixture.email,
  });

  await mediator.send<Éliminé.Recours.RecoursUseCase>({
    type: 'Éliminé.Recours.UseCase.RejeterRecours',
    data: {
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: réponseSignée,
      dateRejetValue: rejetéeLe,
      identifiantUtilisateurValue: rejetéePar,
    },
  });
}

async function passerDemandeRecoursEnInstruction(this: PotentielWorld) {
  const identifiantProjet = this.éliminéWorld.identifiantProjet.formatter();

  const { passéEnInstructionLe, passéEnInstructionPar } =
    this.éliminéWorld.recoursWorld.passerRecoursEnInstructionFixture.créer({
      passéEnInstructionPar: this.utilisateurWorld.adminFixture.email,
    });

  await mediator.send<Éliminé.Recours.RecoursUseCase>({
    type: 'Éliminé.Recours.UseCase.PasserRecoursEnInstruction',
    data: {
      identifiantProjetValue: identifiantProjet,
      dateInstructionValue: passéEnInstructionLe,
      identifiantUtilisateurValue: passéEnInstructionPar,
    },
  });
}
