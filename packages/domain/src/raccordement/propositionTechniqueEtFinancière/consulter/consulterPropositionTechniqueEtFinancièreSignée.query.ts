import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  DossierRaccordementNonRéférencéError,
  FormatFichierInexistantError,
} from '../../raccordement.errors';
import { PropositionTechniqueEtFinancièreSignéeReadModel } from './propositionTechniqueEtFinancièreSignée.readModel';
import { DossierRaccordementReadModel } from '../../dossierRaccordement/consulter/dossierRaccordement.readModel';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';
import { Readable } from 'stream';

const CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE = Symbol(
  'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
);

export type RécupérerPropositionTechniqueEtFinancièreSignéePort = (args: {
  identifiantProjet: string;
  référence: string;
  format: string;
}) => Promise<Readable>;

export type ConsulterPropositionTechniqueEtFinancièreSignéeDependencies = {
  find: Find;
  récupérerPropositionTechniqueEtFinancièreSignée: RécupérerPropositionTechniqueEtFinancièreSignéePort;
};

export type ConsulterPropositionTechniqueEtFinancièreSignéeQuery = Message<
  typeof CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
  },
  PropositionTechniqueEtFinancièreSignéeReadModel
>;

export const registerConsulterPropositionTechniqueEtFinancièreSignéeQuery = ({
  find,
  récupérerPropositionTechniqueEtFinancièreSignée,
}: ConsulterPropositionTechniqueEtFinancièreSignéeDependencies) => {
  const handler: MessageHandler<ConsulterPropositionTechniqueEtFinancièreSignéeQuery> = async ({
    identifiantProjet,
    référence: référenceDossierRaccordement,
  }) => {
    const dossierRaccordement = await find<DossierRaccordementReadModel>(
      `dossier-raccordement#${formatIdentifiantProjet(
        identifiantProjet,
      )}#${référenceDossierRaccordement}`,
    );
    if (isNone(dossierRaccordement)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    if (
      !dossierRaccordement.propositionTechniqueEtFinancière ||
      !dossierRaccordement.propositionTechniqueEtFinancière.format ||
      dossierRaccordement.propositionTechniqueEtFinancière.format === 'none'
    ) {
      throw new FormatFichierInexistantError();
    }

    const fichier = await récupérerPropositionTechniqueEtFinancièreSignée({
      référence: référenceDossierRaccordement,
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      format: dossierRaccordement.propositionTechniqueEtFinancière.format,
    });

    return {
      type: 'proposition-technique-et-financière-signée',
      format: dossierRaccordement.propositionTechniqueEtFinancière.format,
      content: fichier,
    } as Readonly<PropositionTechniqueEtFinancièreSignéeReadModel>;
  };
  mediator.register(CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE, handler);
};

export const buildConsulterPropositionTechniqueEtFinancièreSignéeQuery = getMessageBuilder(
  CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE,
);
