import { DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Candidature } from '@potentiel-domain/projet';

import { PotentielWorld } from '../../potentiel.world';
import { DeepPartial } from '../../fixture';
import { notifierLauréat } from '../../projet/lauréat/stepDefinitions/lauréat.given';
import { notifierÉliminé } from '../../projet/éliminé/stepDefinitions/éliminé.given';

EtantDonné(
  `la candidature lauréate {string} avec :`,
  async function (this: PotentielWorld, nomProjet: string, datatable: DataTable) {
    const exemple = datatable.rowsHash();
    const { dépôt, instruction } = this.candidatureWorld.mapExempleToFixtureValues(exemple);
    await importerCandidature.call(this, nomProjet, 'classé', dépôt, instruction);
  },
);

EtantDonné(
  `la candidature éliminée {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'éliminé');
  },
);

EtantDonné(
  `la candidature lauréate {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'classé');
  },
);

EtantDonné(
  'la candidature lauréate notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'classé');

    const dateDésignation = this.lauréatWorld.dateDésignation;

    await notifierLauréat.call(this, dateDésignation);
  },
);

EtantDonné(
  'la candidature éliminée notifiée {string}',
  async function (this: PotentielWorld, nomProjet: string) {
    await importerCandidature.call(this, nomProjet, 'éliminé');

    const dateDésignation = this.éliminéWorld.dateDésignation;

    await notifierÉliminé.call(this, dateDésignation);
  },
);

export async function importerCandidature(
  this: PotentielWorld,
  nomProjet: string,
  statut: Candidature.StatutCandidature.RawType,
  dépôt?: Omit<DeepPartial<Candidature.Dépôt.RawType>, 'fournisseurs'>,
  instruction?: DeepPartial<Candidature.Instruction.RawType>,
) {
  const { dépôtValue, détailsValue, identifiantProjet, importéLe, importéPar, instructionValue } =
    this.candidatureWorld.importerCandidature.créer({
      dépôt: {
        ...dépôt,
        nomProjet,
      },
      instruction: {
        ...instruction,
        statut,
      },
      importéPar: this.utilisateurWorld.validateurFixture.email,
    });

  await mediator.send<Candidature.ImporterCandidatureUseCase>({
    type: 'Candidature.UseCase.ImporterCandidature',
    data: {
      appelOffreValue: identifiantProjet.appelOffre,
      périodeValue: identifiantProjet.période,
      familleValue: identifiantProjet.famille,
      numéroCREValue: identifiantProjet.numéroCRE,
      dépôtValue,
      détailsValue,
      importéLe,
      importéPar,
      instructionValue,
    },
  });
}
