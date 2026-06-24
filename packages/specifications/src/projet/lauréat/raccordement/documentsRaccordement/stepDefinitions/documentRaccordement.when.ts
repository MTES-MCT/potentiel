import { type DataTable, When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import type { Lauréat } from '@potentiel-domain/projet';

import { convertFixtureFileToReadableStream } from '../../../../../helpers/index.js';
import type { PotentielWorld } from '../../../../../potentiel.world.js';
import type { TransmettreDocumentRaccordement } from '../fixtures/transmettreDocumentRaccordement.fixture.js';

Quand(
  `le porteur transmet un document de raccordement pour le projet lauréat`,
  async function (this: PotentielWorld) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;

    try {
      await transmettreDocumentRaccordement.call(
        this,
        identifiantProjet.formatter(),
        référenceDossier,
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `le porteur transmet un document de raccordement pour le projet lauréat avec :`,
  async function (this: PotentielWorld, datatable: DataTable) {
    const { identifiantProjet } = this.lauréatWorld;
    const { référenceDossier } = this.lauréatWorld.raccordementWorld;

    try {
      await transmettreDocumentRaccordement.call(
        this,
        identifiantProjet.formatter(),
        référenceDossier,
        this.lauréatWorld.raccordementWorld.documentRaccordement.mapExempleToFixtureValues(
          datatable.rowsHash(),
        ),
      );
    } catch (e) {
      this.error = e as Error;
    }
  },
);

export async function transmettreDocumentRaccordement(
  this: PotentielWorld,
  identifiantProjet: string,
  référence: string,
  data: Partial<TransmettreDocumentRaccordement> = {},
) {
  const { dateSignature, document, référenceDossier, type } =
    this.lauréatWorld.raccordementWorld.documentRaccordement.transmettreFixture.créer({
      identifiantProjet,
      référenceDossier: référence,
      ...data,
    });

  await mediator.send<Lauréat.Raccordement.TransmettreDocumentRaccordementUseCase>({
    type: 'Lauréat.Raccordement.UseCase.TransmettreDocumentRaccordement',
    data: {
      dateSignatureValue: dateSignature,
      référenceDossierRaccordementValue: référenceDossier,
      identifiantProjetValue: identifiantProjet,
      documentRaccordementValue: convertFixtureFileToReadableStream(document),
      type,
      transmisLeValue: new Date().toISOString(),
      transmisParValue: this.utilisateurWorld.porteurFixture.email,
    },
  });
}
