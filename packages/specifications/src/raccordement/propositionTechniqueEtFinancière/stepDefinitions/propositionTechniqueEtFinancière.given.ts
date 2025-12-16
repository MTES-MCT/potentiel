import { Given as EtantDonné } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import { publish } from '@potentiel-infrastructure/pg-event-sourcing';

import { PotentielWorld } from '../../../potentiel.world';

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
        propositionTechniqueEtFinancièreSignéeValue: propositionTechniqueEtFinancièreSignée,
      },
    });
  },
);

EtantDonné(
  'une proposition technique et financière sans date de signature pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet, référenceDossier } =
      this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

    const { propositionTechniqueEtFinancièreSignée } =
      this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.créer({
        identifiantProjet,
        référenceDossier,
        dateSignature: undefined,
      });

    const event: Lauréat.Raccordement.PropositionTechniqueEtFinancièreSignéeTransmiseEventV1 = {
      type: 'PropositionTechniqueEtFinancièreSignéeTransmise-V1',
      payload: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
        format: propositionTechniqueEtFinancièreSignée.format,
        référenceDossierRaccordement: référenceDossier,
      },
    };

    await publish(`raccordement|${identifiantProjet}`, event);
  },
);

EtantDonné(
  'une proposition technique et financière sans fichier signé pour le projet lauréat',
  async function (this: PotentielWorld) {
    const { identifiantProjet, référenceDossier } =
      this.raccordementWorld.demandeComplèteDeRaccordement.transmettreFixture;

    const { dateSignature } =
      this.raccordementWorld.propositionTechniqueEtFinancière.transmettreFixture.créer({
        identifiantProjet,
        référenceDossier,
        propositionTechniqueEtFinancièreSignée: undefined,
      });

    const event: Lauréat.Raccordement.PropositionTechniqueEtFinancièreTransmiseEventV1 = {
      type: 'PropositionTechniqueEtFinancièreTransmise-V1',
      payload: {
        identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
        dateSignature: DateTime.convertirEnValueType(dateSignature).formatter(),
        référenceDossierRaccordement: référenceDossier,
      },
    };

    await publish(`raccordement|${identifiantProjet}`, event);
  },
);
