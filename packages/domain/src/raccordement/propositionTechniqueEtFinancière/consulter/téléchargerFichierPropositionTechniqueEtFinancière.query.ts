import { Message, MessageHandler, mediator, getMessageBuilder } from 'mediateur';
import { Find } from '@potentiel/core-domain';
import { isNone } from '@potentiel/monads';
import {
  DossierRaccordementNonRéférencéError,
  FormatFichierInexistantError,
} from '../../raccordement.errors';
import { RécupérerFichierPropositionTechniqueEtFinancièrePort } from './récupérerFichierPropositionTechniqueEtFinancière.port';
import { TéléchargerFichierPropositionTechniqueEtFinancièreReadModel } from './fichierPropositionTechniqueEtFinancière.readModel';
import { DossierRaccordementReadModel } from '../../dossierRaccordement/consulter/dossierRaccordement.readModel';
import { IdentifiantProjet, formatIdentifiantProjet } from '../../../projet/identifiantProjet';

const TÉLÉCHARGER_FICHIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE = Symbol(
  'TÉLÉCHARGER_FICHIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE',
);

export type TéléchargerFichierPropositionTechniqueEtFinancièreDependencies = {
  find: Find;
  récupérerFichierPropositionTechniqueEtFinancière: RécupérerFichierPropositionTechniqueEtFinancièrePort;
};

export type TéléchargerFichierPropositionTechniqueEtFinancièreQuery = Message<
  typeof TÉLÉCHARGER_FICHIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE,
  {
    identifiantProjet: IdentifiantProjet;
    référence: string;
  },
  TéléchargerFichierPropositionTechniqueEtFinancièreReadModel
>;

export const registerTéléchargerFichierPropositionTechniqueEtFinancièreQuery = ({
  find,
  récupérerFichierPropositionTechniqueEtFinancière,
}: TéléchargerFichierPropositionTechniqueEtFinancièreDependencies) => {
  const handler: MessageHandler<TéléchargerFichierPropositionTechniqueEtFinancièreQuery> = async ({
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

    const fichier = await récupérerFichierPropositionTechniqueEtFinancière({
      référence: référenceDossierRaccordement,
      identifiantProjet: formatIdentifiantProjet(identifiantProjet),
      format: dossierRaccordement.propositionTechniqueEtFinancière.format,
    });

    return {
      type: 'fichier-proposition-technique-et-financiere',
      format: dossierRaccordement.propositionTechniqueEtFinancière.format,
      content: fichier,
    } as Readonly<TéléchargerFichierPropositionTechniqueEtFinancièreReadModel>;
  };
  mediator.register(TÉLÉCHARGER_FICHIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE, handler);
};

export const buildTéléchargerFichierPropositionTechniqueEtFinancièreQuery = getMessageBuilder(
  TÉLÉCHARGER_FICHIER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE,
);
