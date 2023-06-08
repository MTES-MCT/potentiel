import { Message, MessageHandler, mediator } from 'mediateur';
import { LoadAggregate, Publish } from '@potentiel/core-domain';
import {
  createRaccordementAggregateId,
  loadRaccordementAggregateFactory,
} from '../raccordement.aggregate';
import { IdentifiantProjetValueType } from '../../projet/projet.valueType';
import { PropositionTechniqueEtFinancièreSignéeTransmiseEvent } from '../raccordement.event';
import { EnregistrerPropositionTechniqueEtFinancièreSignéePort } from '../raccordement.ports';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../raccordement.errors';
import {
  DossierRaccordement,
  PropositionTechniqueEtFinancièreSignée,
  RéférenceDossierRaccordementValueType,
} from '../raccordement.valueType';

export type EnregistrerPropositionTechniqueEtFinancièreSignéeCommand = Message<
  'ENREGISTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE_COMMAND',
  {
    identifiantProjet: IdentifiantProjetValueType;
    référenceDossierRaccordement: RéférenceDossierRaccordementValueType;
    propositionTechniqueEtFinancièreSignée: PropositionTechniqueEtFinancièreSignée;
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
      opération: isNone(dossier.demandeComplèteRaccordement.format) ? 'création' : 'modification',
      type: 'proposition-technique-et-financiere',
      identifiantProjet: identifiantProjet.formatter(),
      propositionTechniqueEtFinancièreSignée,
      référenceDossierRaccordement: référenceDossierRaccordement.formatter(),
    });

    const propositionTechniqueEtFinancièreSignéeTransmise: PropositionTechniqueEtFinancièreSignéeTransmiseEvent =
      {
        type: 'PropositionTechniqueEtFinancièreSignéeTransmise',
        payload: {
          identifiantProjet: identifiantProjet.formatter(),
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
