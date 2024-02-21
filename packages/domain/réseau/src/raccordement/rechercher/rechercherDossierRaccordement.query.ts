import { Message, MessageHandler, mediator } from 'mediateur';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { List } from '@potentiel-domain/core';
import { RéférenceRaccordementIdentifiantProjetEntity } from '../raccordement.entity';

export type RechercherDossierRaccordementReadModel = ReadonlyArray<{
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
}>;

export type RechercherDossierRaccordementQuery = Message<
  'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
  {
    référenceDossierRaccordement: string;
  },
  RechercherDossierRaccordementReadModel
>;

export type RechercherDossierRaccordementDependencies = {
  list: List;
};

export const registerRechercherDossierRaccordementQuery = ({
  list,
}: RechercherDossierRaccordementDependencies) => {
  const handler: MessageHandler<RechercherDossierRaccordementQuery> = async ({
    référenceDossierRaccordement,
  }) => {
    const results = await list<RéférenceRaccordementIdentifiantProjetEntity>({
      type: 'référence-raccordement-projet',
      where: {
        référence: `%${référenceDossierRaccordement}%`,
      },
    });

    return mapToReadModel(results.items);
  };

  mediator.register('RECHERCHER_DOSSIER_RACCORDEMENT_QUERY', handler);
};

const mapToReadModel = (result: ReadonlyArray<RéférenceRaccordementIdentifiantProjetEntity>) => {
  return result.map(({ identifiantProjet, référence }) => ({
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    référenceDossierRaccordement: RéférenceDossierRaccordement.convertirEnValueType(référence),
  }));
};
