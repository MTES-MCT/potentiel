import { Message, MessageHandler, getMessageBuilder, mediator } from 'mediateur';
import { buildConsulterPropositionTechniqueEtFinancièreSignéeQuery } from './consulter/consulterPropositionTechniqueEtFinancièreSignée.query';
import { PropositionTechniqueEtFinancièreSignéeReadModel } from './consulter/propositionTechniqueEtFinancièreSignée.readModel';
import { buildConsulterDossierRaccordementQuery } from '../dossierRaccordement/consulter/consulterDossierRaccordement.query';
import { IdentifiantProjet } from '../../projet/valueType/identifiantProjet';
import { FichierInexistant } from '@potentiel/file-storage';

type ConsulterPropositionTechniqueEtFinancièreUseCaseResult = Omit<
  PropositionTechniqueEtFinancièreSignéeReadModel & Readonly<{ dateSignature: string }>,
  'type'
>;

export type ConsulterPropositionTechniqueEtFinancièreUseCase = Message<
  'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  {
    identifiantProjet: IdentifiantProjet;
    référenceDossierRaccordement: string;
  },
  ConsulterPropositionTechniqueEtFinancièreUseCaseResult
>;

export const registerConsulterPropositionTechniqueEtFinancièreUseCase = () => {
  const runner: MessageHandler<ConsulterPropositionTechniqueEtFinancièreUseCase> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
  }) => {
    const dossierRaccordement = await mediator.send(
      buildConsulterDossierRaccordementQuery({
        identifiantProjet,
        référence: référenceDossierRaccordement,
      }),
    );

    const propositionTechniqueEtFinancièreSignée = await mediator.send(
      buildConsulterPropositionTechniqueEtFinancièreSignéeQuery({
        format: dossierRaccordement.propositionTechniqueEtFinancière?.format || '',
        identifiantProjet,
        référenceDossierRaccordement,
      }),
    );

    if (!propositionTechniqueEtFinancièreSignée) {
      throw new FichierInexistant();
    }

    return {
      ...propositionTechniqueEtFinancièreSignée,
      dateSignature: dossierRaccordement.propositionTechniqueEtFinancière?.dateSignature || '',
    };
  };
  mediator.register('CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE', runner);
};

export const buildConsulterPropositionTechniqueEtFinancièreUseCase =
  getMessageBuilder<ConsulterPropositionTechniqueEtFinancièreUseCase>(
    'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_USECASE',
  );
