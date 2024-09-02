import { Message, MessageHandler, mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/common';
import { List, Where } from '@potentiel-domain/entity';

import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { DossierRaccordementEntity } from '../raccordement.entity';

export type RéférenceRaccordementIdentifiantProjet = {
  identifiantProjet: string;
  référence: string;
};

export type RechercherDossierRaccordementReadModel = ReadonlyArray<{
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
}>;

export type RechercherDossierRaccordementQuery = Message<
  'Réseau.Raccordement.Query.RechercherDossierRaccordement',
  {
    numéroCRE?: string;
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
    numeroCRE,
    référenceDossierRaccordement,
  }) => {
    const results = await list<DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        identifiantProjet: Where.endWith(numeroCRE ? `#${numeroCRE}` : undefined),
        référence: Where.contains(référenceDossierRaccordement),
      },
    });

    return mapToReadModel(
      results.items.map(({ identifiantProjet, référence }) => ({
        identifiantProjet,
        référence,
      })),
    );
  };

  mediator.register('Réseau.Raccordement.Query.RechercherDossierRaccordement', handler);
};

const mapToReadModel = (result: ReadonlyArray<RéférenceRaccordementIdentifiantProjet>) => {
  return result.map(({ identifiantProjet, référence }) => ({
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    référenceDossierRaccordement: RéférenceDossierRaccordement.convertirEnValueType(référence),
  }));
};
