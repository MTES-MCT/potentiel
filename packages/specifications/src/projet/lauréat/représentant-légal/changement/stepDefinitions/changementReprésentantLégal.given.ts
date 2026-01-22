import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world.js';
import { importerCandidature } from '../../../../../candidature/stepDefinitions/candidature.given.js';
import { notifierLauréat } from '../../../stepDefinitions/lauréat.given.js';

EtantDonné(
  /une demande de changement de représentant légal en cours pour le projet lauréat/,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixture =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.créer(
        {},
      );

    await mediator.send<Lauréat.ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixture.nomReprésentantLégal,
        typeReprésentantLégalValue: fixture.typeReprésentantLégal.formatter(),
        pièceJustificativeValue: fixture.pièceJustificative,
        identifiantUtilisateurValue: fixture.demandéPar,
        dateDemandeValue: fixture.demandéLe,
      },
    });
  },
);

EtantDonné(
  'un changement de représentant légal enregistré pour le projet lauréat',
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixture =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.créer(
        {
          statut:
            Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.informationEnregistrée,
        },
      );

    await mediator.send<Lauréat.ReprésentantLégal.EnregistrerChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.EnregistrerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixture.nomReprésentantLégal,
        typeReprésentantLégalValue: fixture.typeReprésentantLégal.formatter(),
        pièceJustificativeValue: fixture.pièceJustificative,
        identifiantUtilisateurValue: fixture.demandéPar,
        dateChangementValue: fixture.demandéLe,
      },
    });
  },
);

EtantDonné(
  'un changement de représentant légal enregistré pour le projet lauréat le {string}',
  async function (this: PotentielWorld, date: string) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixture =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.créer(
        {
          statut:
            Lauréat.ReprésentantLégal.StatutChangementReprésentantLégal.informationEnregistrée,
          demandéLe: DateTime.convertirEnValueType(new Date(date)).formatter(),
        },
      );

    await mediator.send<Lauréat.ReprésentantLégal.EnregistrerChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.EnregistrerChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixture.nomReprésentantLégal,
        typeReprésentantLégalValue: fixture.typeReprésentantLégal.formatter(),
        pièceJustificativeValue: fixture.pièceJustificative,
        identifiantUtilisateurValue: fixture.demandéPar,
        dateChangementValue: fixture.demandéLe,
      },
    });
  },
);

EtantDonné(
  /une demande de changement de représentant légal accordée pour le projet lauréat/,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixtureDemander =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.créer(
        {},
      );

    await mediator.send<Lauréat.ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixtureDemander.nomReprésentantLégal,
        typeReprésentantLégalValue: fixtureDemander.typeReprésentantLégal.formatter(),
        pièceJustificativeValue: fixtureDemander.pièceJustificative,
        identifiantUtilisateurValue: fixtureDemander.demandéPar,
        dateDemandeValue: fixtureDemander.demandéLe,
      },
    });

    const fixtureAccorder =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.accorderChangementReprésentantLégalFixture.créer();

    await mediator.send<Lauréat.ReprésentantLégal.AccorderChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.AccorderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixtureAccorder.nomReprésentantLégal,
        typeReprésentantLégalValue: fixtureAccorder.typeReprésentantLégal.formatter(),
        identifiantUtilisateurValue: fixtureAccorder.accordéePar,
        dateAccordValue: fixtureAccorder.accordéeLe,
        accordAutomatiqueValue: false,
      },
    });
  },
);

EtantDonné(
  /une demande de changement de représentant légal rejetée pour le projet lauréat/,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixtureDemander =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderOuEnregistrerChangementReprésentantLégalFixture.créer(
        {},
      );

    await mediator.send<Lauréat.ReprésentantLégal.ReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.DemanderChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        nomReprésentantLégalValue: fixtureDemander.nomReprésentantLégal,
        typeReprésentantLégalValue: fixtureDemander.typeReprésentantLégal.formatter(),
        pièceJustificativeValue: fixtureDemander.pièceJustificative,
        identifiantUtilisateurValue: fixtureDemander.demandéPar,
        dateDemandeValue: fixtureDemander.demandéLe,
      },
    });

    const fixtureRejeter =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.rejeterChangementReprésentantLégalFixture.créer();

    await mediator.send<Lauréat.ReprésentantLégal.RejeterChangementReprésentantLégalUseCase>({
      type: 'Lauréat.ReprésentantLégal.UseCase.RejeterChangementReprésentantLégal',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: fixtureRejeter.rejetéPar,
        motifRejetValue: fixtureRejeter.motif,
        dateRejetValue: fixtureRejeter.rejetéLe,
        rejetAutomatiqueValue: false,
      },
    });
  },
);

EtantDonné(
  "le projet lauréat {string} sur une période d'appel d'offres avec {accord-rejet} automatique du changement de représentant légal",
  async function (this: PotentielWorld, nomProjet: string, action: 'accord' | 'rejet') {
    const { appelOffre, période } = match(action)
      .with('accord', () => ({
        appelOffre: 'PPE2 - Sol',
        période: '1',
      }))
      .with('rejet', () => ({
        appelOffre: 'PPE2 - Eolien',
        période: '1',
      }))
      .exhaustive();

    await importerCandidature.call(this, {
      nomProjet,
      statut: 'classé',
      identifiantProjet: {
        appelOffre,
        période,
      },
    });

    await notifierLauréat.call(this);
  },
);
