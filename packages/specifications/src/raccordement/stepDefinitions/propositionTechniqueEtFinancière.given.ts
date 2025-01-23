import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Raccordement } from '@potentiel-domain/reseau';

import { PotentielWorld } from '../../potentiel.world';

EtantDonné(
  'une proposition technique et financière pour le dossier de raccordement du projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet, référenceDossier } =
      this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

    const { dateSignature, propositionTechniqueEtFinancièreSignée } =
      this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.créer({
        identifiantProjet,
        référenceDossier,
      });

    await mediator.send<Raccordement.RaccordementUseCase>({
      type: 'Réseau.Raccordement.UseCase.TransmettrePropositionTechniqueEtFinancière',
      data: {
        identifiantProjetValue: identifiantProjet,
        référenceDossierRaccordementValue: référenceDossier,
        dateSignatureValue: dateSignature,
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
      },
    });
  },
);
