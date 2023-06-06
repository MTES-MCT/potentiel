import { Readable } from 'stream';
import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../projet/projet.valueType';
import { PropositionTechniqueEtFinancièreSignéeTransmiseEvent } from '../raccordement.event';
import { EnregistrerPropositionTechniqueEtFinancièreSignéePort } from '../raccordement.ports';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import { DossierRaccordement, RéférenceDossierRaccordement } from '../raccordement.valueType';

export type EnregistrerPropositionTechniqueEtFinancièreSignéeCommand = Message<
  'ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: RéférenceDossierRaccordement;
    propositionTechniqueEtFinancièreSignée: { format: string; content: Readable };
  }
>;

export type EnregistrerPropositionTechniqueEtFinancièreSignéeDependencies = {
  publish: Publish;
  loadAggregate: LoadAggregate;
  enregistrerPropositionTechniqueEtFinancièreSignée: EnregistrerPropositionTechniqueEtFinancièreSignéePort;
};

export const registerEnregistrerPropositionTechniqueEtFinancièreSignéeCommand = ({
  publish,
  loadAggregate,
  enregistrerPropositionTechniqueEtFinancièreSignée,
}: EnregistrerPropositionTechniqueEtFinancièreSignéeDependencies) => {
  const loadRaccordement = loadRaccordementAggregateFactory({
    loadAggregate,
  });

  const handler: MessageHandler<EnregistrerPropositionTechniqueEtFinancièreSignéeCommand> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    propositionTechniqueEtFinancièreSignée,
  }) => {
    const raccordement = await loadRaccordement(identifiantProjet);

    if (isNone(raccordement) || !raccordement.contientLeDossier(référenceDossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    const dossier = raccordement.dossiers.get(
      référenceDossierRaccordement.formatter(),
    ) as DossierRaccordement;

    await enregistrerPropositionTechniqueEtFinancièreSignée({
      type: isNone(dossier.demandeComplèteRaccordement.format) ? 'création' : 'modification',
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      propositionTechniqueEtFinancièreSignée,
      référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
    });

    const propositionTechniqueEtFinancièreSignéeTransmise: PropositionTechniqueEtFinancièreSignéeTransmiseEvent =
      {
        type: 'PropositionTechniqueEtFinancièreSignéeTransmise',
        payload: {
          identifiantProjet: formatIdentifiantProjet(identifiantProjet),
          format: propositionTechniqueEtFinancièreSignée.format,
          référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
        },
      };

    await publish(
      createRaccordementAggregateId(identifiantProjet),
      propositionTechniqueEtFinancièreSignéeTransmise,
    );
  };

  mediator.register('ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND', handler);
};
