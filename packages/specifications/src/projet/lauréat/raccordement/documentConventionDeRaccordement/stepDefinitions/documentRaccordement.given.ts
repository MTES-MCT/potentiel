import { type DataTable, Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import type { Lauréat } from '@potentiel-domain/projet';

import { convertFixtureFileToReadableStream } from '#helpers';
import type { PotentielWorld } from '../../../../../potentiel.world.js';

EtantDonné(
  'un document de raccordement pour le projet lauréat avec :',
  async function (this: PotentielWorld, database: DataTable) {
    const { identifiantProjet, référenceDossier } =
      this.lauréatWorld.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

    const { dateSignature, propositionTechniqueEtFinancièreSignée } =
      this.lauréatWorld.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.créer(
        {
          identifiantProjet,
          référenceDossier,
        },
      );

    await mediator.send<Lauréat.Raccordement.TransmettrePropositionTechniqueEtFinancièreUseCase>({
      type: 'Lauréat.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: référenceDossier,
        dateSignatureValue: dateSignature,
        propositionTechniqueEtFinancièreSignéeValue: convertFixtureFileToReadableStream(
          propositionTechniqueEtFinancièreSignée,
        ),
        transmiseLeValue: new Date().toISOString(),
        transmiseParValue: this.utilisateurWorld.porteurFixture.email,
      },
    });
  },
);
