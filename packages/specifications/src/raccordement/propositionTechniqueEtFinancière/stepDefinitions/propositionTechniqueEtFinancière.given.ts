import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import type { Lauréat } from '@potentiel-domain/projet';

import { convertFixtureFileToReadableStream } from '#helpers';
import type { PotentielWorld } from '../../../potentiel.world.js';

EtantDonné(
  'une proposition technique et financière pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet, référenceDossier } =
      this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

    const { dateSignature, propositionTechniqueEtFinancièreSignée } =
      this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.créer({
        identifiantProjet,
        référenceDossier,
      });

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
