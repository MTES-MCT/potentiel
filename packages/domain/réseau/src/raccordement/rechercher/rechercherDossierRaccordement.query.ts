import { Message, MessageHandler, mediator } from 'mediateur';
import * as RéférenceDossierRaccordement from '../référenceDossierRaccordement.valueType';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Find } from '@potentiel-libraries/projection';
import { RéférenceRaccordementIdentifiantProjetEntity } from '../raccordement.entity';
import { isNone } from '@potentiel/monads';
import { DossierRaccordementNonRéférencéError } from '../dossierRaccordementNonRéférencé.error';

export type RechercherDossierRaccordementReadModel = {
  référenceDossierRaccordement: RéférenceDossierRaccordement.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export type RechercherDossierRaccordementQuery = Message<
  'RECHERCHER_DOSSIER_RACCORDEMENT_QUERY',
  {
    référenceDossierRaccordement: string;
  },
  RechercherDossierRaccordementReadModel
>;

export type RechercherDossierRaccordementDependencies = {
  find: Find;
};

export const registerRechercherDossierRaccordementQuery = ({
  find,
}: RechercherDossierRaccordementDependencies) => {
  const handler: MessageHandler<RechercherDossierRaccordementQuery> = async ({
    référenceDossierRaccordement,
  }) => {
    const result = await find<RéférenceRaccordementIdentifiantProjetEntity>(
      `référence-raccordement-projet|${référenceDossierRaccordement}`,
    );

    if (isNone(result)) {
      throw new DossierRaccordementNonRéférencéError();
    }

    return mapToReadModel(result);
  };

  mediator.register('RECHERCHER_DOSSIER_RACCORDEMENT_QUERY', handler);
};

const mapToReadModel = (result: RéférenceRaccordementIdentifiantProjetEntity) => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(result.identifiantProjet),
    référenceDossierRaccordement: RéférenceDossierRaccordement.convertirEnValueType(
      result.référence,
    ),
  };
};
