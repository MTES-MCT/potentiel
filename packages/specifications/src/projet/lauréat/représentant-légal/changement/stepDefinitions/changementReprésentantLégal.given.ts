import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../../potentiel.world';
import { importerCandidature } from '../../../../../candidature/stepDefinitions/candidature.given';
import {
  insérerProjetAvecDonnéesCandidature,
  notifierLauréat,
} from '../../../stepDefinitions/lauréat.given';

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

    this.tâchePlanifiéeWorld.ajouterTâchePlanifiéeFixture.créer({
      identifiantProjet,
      ajoutéeLe: dateDemande.formatter(),
      àExécuterLe: dateDemande.ajouterNombreDeMois(3).formatter(),
      typeTâchePlanifiée: 'gestion automatique de la demande de changement de représentant légal',
    });

    await mediator.send<ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
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

    await mediator.send<ReprésentantLégal.DemanderChangementReprésentantLégalUseCase>({
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

    await mediator.send<ReprésentantLégal.AccorderChangementReprésentantLégalUseCase>({
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

    await mediator.send<ReprésentantLégal.ReprésentantLégalUseCase>({
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

    await mediator.send<ReprésentantLégal.RejeterChangementReprésentantLégalUseCase>({
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
    const identifiantProjet = match(action)
      .with('accord', () => `PPE2 - Sol#1##test-1`)
      .with('rejet', () => `PPE2 - Eolien#1##test-2`)
      .exhaustive();

    await importerCandidature.call(this, nomProjet, 'classé', undefined, identifiantProjet);

    const dateDésignation = this.lauréatWorld.dateDésignation;
    await notifierLauréat.call(this, dateDésignation);
    await insérerProjetAvecDonnéesCandidature.call(this, dateDésignation, 'lauréat');
  },
);
