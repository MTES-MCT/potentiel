//@ts-ignore
import { Project } from '../../../../../src/infra/sequelize/projectionsNext';
import {
  IdentifiantProjet,
  RawIdentifiantProjet,
  convertirEnIdentifiantProjet,
  estUnIdentifiantProjet,
} from '@potentiel/domain';

import { ProjetReadModel, ProjetReadModelKey } from '../projet.readModel';
import { Message, MessageHandler, mediator } from 'mediateur';
import { Find } from '../../common.port';
import { Option, isSome, none } from '@potentiel/monads';

export type ConsulterProjetReadModel = ProjetReadModel & {
  identifiantProjet: RawIdentifiantProjet;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  statut: 'non-notifié' | 'abandonné' | 'classé' | 'éliminé';
  nom: string;
  localité: {
    commune: string;
    département: string;
    région: string;
  };
};

export type ConsulterProjetQuery = Message<
  'CONSULTER_PROJET',
  {
    identifiantProjet: RawIdentifiantProjet | IdentifiantProjet;
  },
  Option<ConsulterProjetReadModel>
>;

export type ConsulterProjetDependencies = {
  find: Find;
};

export const registerConsulterProjetQuery = ({ find }: ConsulterProjetDependencies) => {
  const queryHandler: MessageHandler<ConsulterProjetQuery> = async ({ identifiantProjet }) => {
    const identifiantProjetValueType = convertirEnIdentifiantProjet(identifiantProjet);
    const projetLegacy = await Project.findOne({
      where: {
        appelOffreId: identifiantProjetValueType.appelOffre,
        periodeId: identifiantProjetValueType.période,
        familleId: isSome(identifiantProjetValueType.famille) ?? undefined,
        numeroCRE: identifiantProjetValueType.numéroCRE,
      },
      attributes: [
        'id',
        'nomProjet',
        'nomCandidat',
        'communeProjet',
        'regionProjet',
        'departementProjet',
        'periodeId',
        'familleId',
        'appelOffreId',
        'numeroCRE',
        'notifiedOn',
        'abandonedOn',
        'classe',
      ],
    });

    if (!projetLegacy) {
      return none;
    }

    const rawIdentifiantProjet = estUnIdentifiantProjet(identifiantProjet)
      ? convertirEnIdentifiantProjet(identifiantProjet).formatter()
      : identifiantProjet;

    const key: ProjetReadModelKey = `projet#${rawIdentifiantProjet}`;
    const result = await find<ProjetReadModel>(key);

    return {
      type: 'projet',
      identifiantProjet: rawIdentifiantProjet,
      appelOffre: projetLegacy.appelOffreId,
      période: projetLegacy.periodeId,
      famille: projetLegacy.familleId,
      numéroCRE: projetLegacy.numeroCRE,
      statut: getStatutProjet(projetLegacy),
      nom: projetLegacy.nomProjet,
      localité: {
        commune: projetLegacy.communeProjet,
        département: projetLegacy.departementProjet,
        région: projetLegacy.regionProjet,
      },
      identifiantGestionnaire: isSome(result) ? result.identifiantGestionnaire : undefined,
    };
  };

  mediator.register('CONSULTER_PROJET', queryHandler);
};

const getStatutProjet = (projet: Project): ConsulterProjetReadModel['statut'] => {
  if (!projet.notifiedOn) {
    return 'non-notifié';
  }
  if (projet.abandonedOn !== 0) {
    return 'abandonné';
  }
  if (projet.classe === 'Classé') {
    return 'classé';
  }

  return 'éliminé';
};
