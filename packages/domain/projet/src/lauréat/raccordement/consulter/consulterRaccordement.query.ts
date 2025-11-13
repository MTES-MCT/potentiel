import { Message, MessageHandler, mediator } from 'mediateur';

import { Find, List, Where } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { DossierRaccordementEntity, RaccordementEntity } from '../raccordement.entity';
import { IdentifiantProjet } from '../../..';

import {
  ConsulterDossierRaccordementReadModel,
  mapToReadModel as mapToDossierRaccordementReadModel,
} from './consulterDossierRaccordement.query';

export type ConsulterRaccordementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau?: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  dossiers: Array<ConsulterDossierRaccordementReadModel>;
};

export type ConsulterRaccordementQuery = Message<
  'Lauréat.Raccordement.Query.ConsulterRaccordement',
  {
    identifiantProjetValue: string;
  },
  Option.Type<ConsulterRaccordementReadModel>
>;

export type ConsulterRaccordementDependencies = {
  find: Find;
  list: List;
};

export const registerConsulterRaccordementQuery = ({
  find,
  list,
}: ConsulterRaccordementDependencies) => {
  const handler: MessageHandler<ConsulterRaccordementQuery> = async ({
    identifiantProjetValue,
  }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const raccordement = await find<RaccordementEntity>(
      `raccordement|${identifiantProjet.formatter()}`,
    );

    if (Option.isNone(raccordement)) {
      return raccordement;
    }

    const dossiersRaccordement = await list<DossierRaccordementEntity>(`dossier-raccordement`, {
      where: { identifiantProjet: Where.equal(identifiantProjet.formatter()) },
    });

    return mapToReadModel(raccordement, dossiersRaccordement.items);
  };

  mediator.register('Lauréat.Raccordement.Query.ConsulterRaccordement', handler);
};

const mapToReadModel = (
  { identifiantProjet, identifiantGestionnaireRéseau }: RaccordementEntity,
  dossiers: ReadonlyArray<DossierRaccordementEntity>,
): ConsulterRaccordementReadModel => {
  return {
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    dossiers: dossiers.map(mapToDossierRaccordementReadModel),
  };
};
