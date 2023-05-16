import { Publish, LoadAggregate, CommandHandlerFactory } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet';
import {
  loadRaccordementAggregateFactory,
  createRaccordementAggregateId,
} from '../raccordement.aggregate';
import { PropositionTechniqueEtFinancièreModifiéeEvent } from './PropositionTechniqueEtFinancièreModifiée.event';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { Readable } from 'stream';
import {
  EnregistrerFichierPropositionTechniqueEtFinancière,
  FichierPropositionTechniqueEtFinancièreTransmisEvent,
} from '../transmettrePropositionTechniqueEtFinancière';

type ModifierPropositionTechniqueEtFinancièreCommand = {
  identifiantProjet: IdentifiantProjet;
  dateSignature: Date;
  référenceDossierRaccordement: string;
  nouveauFichier: { format: string; content: Readable };
};

type ModifierPropositionTechniqueEtFinancièreDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerFichierPropositionTechniqueEtFinancière: EnregistrerFichierPropositionTechniqueEtFinancière;
};

export const modifierPropositionTechniqueEtFinancièreCommandHandlerFactory: CommandHandlerFactory<
  ModifierPropositionTechniqueEtFinancièreCommand,
  ModifierPropositionTechniqueEtFinancièreDependencies
> =
  ({ publish, loadAggregate, enregistrerFichierPropositionTechniqueEtFinancière }) =>
  async ({
    identifiantProjet,
    référenceDossierRaccordement,
    dateSignature,
    nouveauFichier: { format, content },
  }) => {
    const loadRaccordementAggregate = loadRaccordementAggregateFactory({
      loadAggregate,
    });

    const raccordement = await loadRaccordementAggregate(identifiantProjet);

    if (isNone(raccordement) || !raccordement.références.includes(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const propositionTechniqueEtFinancièreModifiéeEvent: PropositionTechniqueEtFinancièreModifiéeEvent =
      {
        type: 'PropositionTechniqueEtFinancièreModifiée',
        payload: {
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
          dateSignature: dateSignature.toISOString(),
          référenceDossierRaccordement,
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      propositionTechniqueEtFinancièreModifiéeEvent,
    );

    const fichierPropositionTechniqueEtFinancièreTransmisEvent: FichierPropositionTechniqueEtFinancièreTransmisEvent =
      {
        type: 'FichierPropositionTechniqueEtFinancièreTransmis',
        payload: {
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
          référenceDossierRaccordement,
          format,
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      fichierPropositionTechniqueEtFinancièreTransmisEvent,
    );

    await enregistrerFichierPropositionTechniqueEtFinancière({
      identifiantProjet,
      référenceDossierRaccordement,
      format,
      content,
    });
  };
