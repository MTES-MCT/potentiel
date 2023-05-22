import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import {
  ConsulterPropositionTechniqueEtFinancièreSignéeQuery,
  buildConsulterPropositionTechniqueEtFinancièreSignéeQuery,
} from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import { PropositionTechniqueEtFinancièreSignéeReadModel } from './consulter/propositionTechniqueEtFinancièreSignée.readModel';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';
import { FormatFichierInexistantError } from '../raccordement.errors';

const CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE = Symbol(
  'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
);

type ConsulterPropositionTechniqueEtFinancièreUseCaseResult = Omit<
  PropositionTechniqueEtFinancièreSignéeReadModel & Readonly<{ dateSignature: string }>,
  'type'
>;

export type ConsulterPropositionTechniqueEtFinancièreUseCase = Message<
  typeof CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE,
  ConsulterPropositionTechniqueEtFinancièreSignéeQuery['data'],
  ConsulterPropositionTechniqueEtFinancièreUseCaseResult
>;

export const registerConsulterPropositionTechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<ConsulterPropositionTechniqueEtFinancièreUseCase> = async ({
    identifiantProjet,
    référence,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({ identifiantProjet, référence }),
    );

    if (
      !dossierRaccordement.propositionTechniqueEtFinancière ||
      !dossierRaccordement.propositionTechniqueEtFinancière.format ||
      dossierRaccordement.propositionTechniqueEtFinancière.format === 'none'
    ) {
      throw new FormatFichierInexistantError();
    }

    const propositionTechniqueEtFinancièreSignée = await mediator.send(
      buildConsulterPropositionTechniqueEtFinancièreSignéeQuery({
        format: dossierRaccordement.propositionTechniqueEtFinancière.format,
        identifiantProjet,
        référence,
      }),
    );

    return {
      ...propositionTechniqueEtFinancièreSignée,
      dateSignature: dossierRaccordement.propositionTechniqueEtFinancière.dateSignature,
    };
  };
  mediator.register(CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE, runner);
};

export const buildConsulterPropositionTechniqueEtFinancièreUseCase =
  getMessageBuilder<ConsulterPropositionTechniqueEtFinancièreUseCase>(
    CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE,
  );
