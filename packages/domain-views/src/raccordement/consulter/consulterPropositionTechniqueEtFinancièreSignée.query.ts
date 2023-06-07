import { IdentifiantProjet } from '@potentiel/domain';
import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { PropositionTechniqueEtFinancièreSignéeReadModel } from '../raccordement.readModel';
import { RécupérerPropositionTechniqueEtFinancièreSignéePort } from '../raccordement.ports';

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
      type: 'proposition-technique-et-financiere',
      référenceDossierRaccordement,
      identifiantProjet: identifiantProjet.formatter(),
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
