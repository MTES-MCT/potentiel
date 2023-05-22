import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { PropositionTechniqueEtFinancièreSignéeReadModel } from './propositionTechniqueEtFinancièreSignée.readModel';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';
import { Readable } from 'stream';

const CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE = Symbol(
  'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
);

export type RécupérerPropositionTechniqueEtFinancièreSignéePort = (args: {
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
}) => Promise<Readable>;

export type ConsulterPropositionTechniqueEtFinancièreSignéeDependencies = {
  récupérerPropositionTechniqueEtFinancièreSignée: RécupérerPropositionTechniqueEtFinancièreSignéePort;
};

export type ConsulterPropositionTechniqueEtFinancièreSignéeQuery = Message<
  typeof CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE,
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    format: string;
  },
  PropositionTechniqueEtFinancièreSignéeReadModel
>;

export const registerConsulterPropositionTechniqueEtFinancièreSignéeQuery = ({
  récupérerPropositionTechniqueEtFinancièreSignée,
}: ConsulterPropositionTechniqueEtFinancièreSignéeDependencies) => {
  const handler: MessageHandler<ConsulterPropositionTechniqueEtFinancièreSignéeQuery> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
    format,
  }) => {
    const content = await récupérerPropositionTechniqueEtFinancièreSignée({
      référenceDossierRaccordement,
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      format,
    });

    return {
      type: 'proposition-technique-et-financière-signée',
      format,
      content,
    };
  };
  mediator.register(CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE, handler);
};

export const buildConsulterPropositionTechniqueEtFinancièreSignéeQuery =
  getMessageBuilder<ConsulterPropositionTechniqueEtFinancièreSignéeQuery>(
    CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE,
  );
