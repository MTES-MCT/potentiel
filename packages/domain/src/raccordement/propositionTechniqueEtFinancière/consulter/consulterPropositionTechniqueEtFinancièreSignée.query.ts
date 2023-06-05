import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { PropositionTechniqueEtFinancièreSignéeReadModel } from './propositionTechniqueEtFinancièreSignée.readModel';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/projet.valueType';
import { Readable } from 'stream';

export type RécupérerPropositionTechniqueEtFinancièreSignéePort = (args: {
  identifiantProjet: string;
  référenceDossierRaccordement: string;
  format: string;
}) => Promise<Readable | undefined>;

export type ConsulterPropositionTechniqueEtFinancièreSignéeDependencies = {
  récupérerPropositionTechniqueEtFinancièreSignée: RécupérerPropositionTechniqueEtFinancièreSignéePort;
};

export type ConsulterPropositionTechniqueEtFinancièreSignéeQuery = Message<
  'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
    format: string;
  },
  PropositionTechniqueEtFinancièreSignéeReadModel | undefined
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

    if (!content) {
      return undefined;
    }

    return {
      type: 'proposition-technique-et-financière-signée',
      format,
      content: content || undefined,
    } satisfies PropositionTechniqueEtFinancièreSignéeReadModel;
  };
  mediator.register('CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE', handler);
};

export const buildConsulterPropositionTechniqueEtFinancièreSignéeQuery =
  getMessageBuilder<ConsulterPropositionTechniqueEtFinancièreSignéeQuery>(
    'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
  );
