import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  RawRéférenceDossierRaccordement,
  RéférenceDossierRaccordement,
  convertirEnIdentifiantProjet,
  convertirEnRéférenceDossierRaccordement,
  estUnIdentifiantProjet,
  estUneRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Option, isNone, none } from '@potentiel/monads';
import {
  DossierRaccordementReadModelKey,
  LegacyDossierRaccordementReadModel,
  PropositionTechniqueEtFinancièreSignéeReadModel,
} from '../raccordement.readModel';
import { RécupérerPropositionTechniqueEtFinancièreSignéePort } from '../raccordement.ports';
import { Find } from '../../common.port';

export type ConsulterPropositionTechniqueEtFinancièreSignéeDependencies = {
  find: Find;
  récupérerPropositionTechniqueEtFinancièreSignée: RécupérerPropositionTechniqueEtFinancièreSignéePort;
};

export type ConsulterPropositionTechniqueEtFinancièreSignéeQuery = Message<
  'CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
    référenceDossierRaccordement: RawRéférenceDossierRaccordement | RéférenceDossierRaccordement;
  },
  Option<PropositionTechniqueEtFinancièreSignéeReadModel>
>;

export const registerConsulterPropositionTechniqueEtFinancièreSignéeQuery = ({
  find,
  récupérerPropositionTechniqueEtFinancièreSignée,
}: ConsulterPropositionTechniqueEtFinancièreSignéeDependencies) => {
  const handler: MessageHandler<ConsulterPropositionTechniqueEtFinancièreSignéeQuery> = async ({
    identifiantProjet,
    référenceDossierRaccordement,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;
    const rawRéférenceDossierRaccordement = estUneRéférenceDossierRaccordement(
      référenceDossierRaccordement,
    )
      ? convertirEnRéférenceDossierRaccordement(référenceDossierRaccordement).formatter()
      : référenceDossierRaccordement;

    const key: DossierRaccordementReadModelKey = `dossier-raccordement|${rawIdentifiantProjet}#${rawRéférenceDossierRaccordement}`;

    const dossierRaccordement = await find<LegacyDossierRaccordementReadModel>(key);

    if (
      isNone(dossierRaccordement) ||
      !dossierRaccordement.propositionTechniqueEtFinancière ||
      !dossierRaccordement.propositionTechniqueEtFinancière.format
    ) {
      return none;
    }

    const content = await récupérerPropositionTechniqueEtFinancièreSignée({
      type: 'proposition-technique-et-financiere',
      identifiantProjet: rawIdentifiantProjet,
      référenceDossierRaccordement: rawRéférenceDossierRaccordement,
      format: dossierRaccordement.propositionTechniqueEtFinancière.format,
    });

    if (!content) {
      return none;
    }

    return {
      type: 'proposition-technique-et-financière-signée',
      format: dossierRaccordement.propositionTechniqueEtFinancière.format,
      content: content,
    } satisfies PropositionTechniqueEtFinancièreSignéeReadModel;
  };
  mediator.register('CONSULTER_PROPOSITION_TECHNIQUE_ET_FINANCIÈRE_SIGNÉE', handler);
};
