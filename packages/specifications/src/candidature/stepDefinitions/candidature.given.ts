import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/candidature';
import { Lauréat } from '@potentiel-domain/laureat';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Éliminé } from '@potentiel-domain/elimine';
import { executeQuery } from '@potentiel-libraries/pg-helpers';

import { PotentielWorld } from '../../potentiel.world';
import { DeepPartial } from '../../fixture';

import { vérifierAttestationDeDésignation } from './candidature.then';

EtantDonné(
  `la candidature lauréate {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    await importerCandidature.call(
      this,
      nomProjet,
      'classé',
      this.candidatureWorld.mapExempleToFixtureValues(exemple),
    );
  },
);

EtantDonné(
  `la candidature {lauréate-éliminée} {string}`,
  async function (
    this: PotentielWorld,
    statutCandidature: 'lauréate' | 'éliminée',
    nomProjet: string,
  ) {
    await importerCandidature.call(
      this,
      nomProjet,
      statutCandidature === 'lauréate' ? 'classé' : 'éliminé',
    );
  },
);

EtantDonné(
  'la candidature lauréate notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'classé');
    await notifierCandidature.call(this);
  },
);

EtantDonné(
  'la candidature éliminée notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'éliminé');

    await notifierCandidature.call(this);
  },
);

export async function importerCandidature(
  this: PotentielWorld,
  nomProjet: string,
  statut: Candidature.StatutCandidature.RawType,
  partialValues?: DeepPartial<Candidature.ImporterCandidatureUseCase['data']>,
) {
  const { values } = this.candidatureWorld.importerCandidature.créer({
    values: {
      ...partialValues,
      statutValue: statut,
      nomProjetValue: nomProjet,
      importéPar: this.utilisateurWorld.validateurFixture.email,
    },
  });
  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: values,
  });

  // TODO:
  // this should mock insert projects too
  // on est obligés de faire ça car CandidatureSaga n'est pas registered
  await executeQuery(
    `
      insert into "projects" (
        "id",
        "appelOffreId",
        "periodeId",
        "numeroCRE",
        "familleId",
        "notifiedOn",
        "nomCandidat",
        "nomProjet",
        "puissance",
        "prixReference",
        "evaluationCarbone",
        "note",
        "nomRepresentantLegal",
        "email",
        "codePostalProjet",
        "communeProjet",
        "departementProjet",
        "regionProjet",
        "classe",
        "isFinancementParticipatif",
        "isInvestissementParticipatif",
        "engagementFournitureDePuissanceAlaPointe"
      )
      values (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21,
        $22
      )
    `,
    randomUUID(),
    this.candidatureWorld.importerCandidature.values.appelOffreValue,
    this.candidatureWorld.importerCandidature.values.périodeValue,
    this.candidatureWorld.importerCandidature.values.numéroCREValue,
    this.candidatureWorld.importerCandidature.values.familleValue,
    new Date().getTime(),
    this.candidatureWorld.importerCandidature.values.nomCandidatValue,
    this.candidatureWorld.importerCandidature.values.nomProjetValue,
    0,
    0,
    0,
    0,
    'nomRepresentantLegal',
    'email',
    'codePostalProjet',
    'communeProjet',
    'departementProjet',
    'regionProjet',
    'Classé',
    false,
    false,
    false,
  );
}

export async function notifierCandidature(this: PotentielWorld) {
  const {
    identifiantProjet,
    values: { statutValue, nomProjetValue },
  } = this.candidatureWorld.importerCandidature;
  this.utilisateurWorld.porteurFixture.créer({
    email: this.candidatureWorld.importerCandidature.values.emailContactValue,
  });

  const notifiéLeValue = DateTime.now().formatter();

  const data = {
    identifiantProjetValue: identifiantProjet,
    notifiéLeValue: DateTime.now().formatter(),
    notifiéParValue: this.utilisateurWorld.validateurFixture.email,
    attestationValue: {
      format: `application/pdf`,
    },
    validateurValue: {
      fonction: this.utilisateurWorld.validateurFixture.fonction,
      nomComplet: this.utilisateurWorld.validateurFixture.nom,
    },
  };
  if (statutValue === 'classé') {
    await mediator.send<Lauréat.NotifierLauréatUseCase>({
      type: 'Lauréat.UseCase.NotifierLauréat',
      data,
    });

    // violette
    //test en plus
    this.lauréatWorld.lauréatFixtures.set(nomProjetValue, {
      nom: nomProjetValue,
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      dateDésignation: notifiéLeValue,
      appelOffre: IdentifiantProjet.convertirEnValueType(identifiantProjet).appelOffre,
      période: IdentifiantProjet.convertirEnValueType(identifiantProjet).période,
    });
  } else {
    await mediator.send<Éliminé.NotifierÉliminéUseCase>({
      type: 'Éliminé.UseCase.NotifierÉliminé',
      data,
    });
  }
  // on vérifie l'attestation de désignation dès le "given"
  // afin de s'assurer que la saga est bien exécutée
  await vérifierAttestationDeDésignation(identifiantProjet);
}
