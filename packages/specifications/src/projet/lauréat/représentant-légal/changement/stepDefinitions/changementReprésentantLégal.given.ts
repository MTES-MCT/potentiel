import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../../../../potentiel.world';
import { importerCandidature } from '../../../../../candidature/stepDefinitions/candidature.given';
import { notifierLauréat } from '../../../stepDefinitions/lauréat.given';

EtantDonné(
  /une demande de changement de représentant légal en cours pour le projet lauréat/,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixture =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
        {
          identifiantProjet,
        },
      );

    const dateDemande = DateTime.convertirEnValueType(fixture.demandéLe);

    this.tâchePlanifiéeWorld.ajouterTâchesPlanifiéesFixture.créer({
      tâches: [
        {
          identifiantProjet,
          ajoutéeLe: dateDemande.formatter(),
          àExécuterLe: dateDemande.ajouterNombreDeMois(3).formatter(),
          typeTâchePlanifiée:
            'gestion automatique de la demande de changement de représentant légal',
        },
        {
          identifiantProjet,
          ajoutéeLe: dateDemande.formatter(),
          àExécuterLe: dateDemande.ajouterNombreDeMois(2).formatter(),
          typeTâchePlanifiée:
            "rappel d'instruction de la demande de changement de représentant légal à deux mois",
        },
      ],
    });

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
  /une demande de changement de représentant légal accordée pour le projet lauréat/,
  async function (this: PotentielWorld) {
    const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

    const fixtureDemander =
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
        {
          identifiantProjet,
        },
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
      this.lauréatWorld.représentantLégalWorld.changementReprésentantLégalWorld.demanderChangementReprésentantLégalFixture.créer(
        {
          identifiantProjet,
        },
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
  "le projet lauréat {string} sur une période d'appel d'offre avec {accord-rejet} automatique du changement de représentant légal",
  async function (this: PotentielWorld, nomProjet: string, action: 'accord' | 'rejet') {
    const { appelOffreValue, périodeValue } = match(action)
      .with('accord', () => ({
        appelOffreValue: 'PPE2 - Sol',
        périodeValue: '1',
      }))
      .with('rejet', () => ({
        appelOffreValue: 'PPE2 - Eolien',
        périodeValue: '1',
      }))
      .exhaustive();

    await importerCandidature.call(this, nomProjet, 'classé', {
      appelOffreValue,
      périodeValue,
    });

    const dateDésignation = this.lauréatWorld.dateDésignation;
    await notifierLauréat.call(this, dateDésignation);
  },
);
