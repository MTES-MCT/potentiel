import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';
import { Message, MessageHandler, mediator } from 'mediateur';
import {
  PiéceJustificativeAbandonProjetReadModel,
  ProjetReadModel,
  ProjetReadModelKey,
} from '../projet.readModel';
import { Option, isNone, none } from '@potentiel/monads';
import { Find } from '@potentiel/core-domain-views';
import { RécupérerPiéceJustificativeAbandonProjetPort } from '../projet.ports';

export type ConsulterPiéceJustificativeAbandonProjetQuery = Message<
  'CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<PiéceJustificativeAbandonProjetReadModel>
>;

export type ConsulterPiéceJustificativeAbandonProjetDependencies = {
  find: Find;
  récupérerPiéceJustificativeAbandonProjet: RécupérerPiéceJustificativeAbandonProjetPort;
};

export const registerConsulterPiéceJustificativeAbandonProjetQuery = ({
  find,
  récupérerPiéceJustificativeAbandonProjet,
}: ConsulterPiéceJustificativeAbandonProjetDependencies) => {
  const handler: MessageHandler<ConsulterPiéceJustificativeAbandonProjetQuery> = async ({
    identifiantProjet,
  }) => {
    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: ProjetReadModelKey = `projet|${rawIdentifiantProjet}`;

    const projet = await find<ProjetReadModel>(key);

    if (isNone(projet)) {
      return none;
    }

    const content = await récupérerPiéceJustificativeAbandonProjet(
      rawIdentifiantProjet,
      projet.piéceJustificative?.format || '',
    );

    if (!content) {
      return none;
    }

    return {
      type: 'piéce-justificative-abandon-projet',
      format: projet.piéceJustificative?.format || '',
      content,
    } satisfies PiéceJustificativeAbandonProjetReadModel;
  };
  mediator.register('CONSULTER_PIECE_JUSTIFICATIVE_ABANDON_PROJET', handler);
};
