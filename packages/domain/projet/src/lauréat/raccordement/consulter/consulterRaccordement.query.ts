import { Message, MessageHandler, mediator } from 'mediateur';

import { Find, Joined, LeftJoin, List, Where } from '@potentiel-domain/entity';
import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { DateTime, Email } from '@potentiel-domain/common';

import { DossierRaccordementEntity } from '../dossierRaccordement.entity.js';
import { RaccordementEntity } from '../raccordement.entity.js';
import { IdentifiantProjet } from '../../../index.js';
import { RéférenceDossierRaccordement } from '../index.js';

import {
  ConsulterDossierRaccordementReadModel,
  mapToReadModel as mapToDossierRaccordementReadModel,
} from './consulterDossierRaccordement.query.js';

export type ConsulterRaccordementReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  gestionnaireRéseau: Option.Type<{
    raisonSociale: string;
    contactEmail?: Email.ValueType;
  }>;
  dossiers: Array<ConsulterDossierRaccordementReadModel>;
  miseEnService?: {
    date: DateTime.ValueType;
    référenceDossier: RéférenceDossierRaccordement.ValueType;
  };
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

    const raccordement = await find<
      RaccordementEntity,
      LeftJoin<GestionnaireRéseau.GestionnaireRéseauEntity>
    >(`raccordement|${identifiantProjet.formatter()}`, {
      join: {
        entity: 'gestionnaire-réseau',
        on: 'identifiantGestionnaireRéseau',
        type: 'left',
      },
    });

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
  {
    identifiantProjet,
    identifiantGestionnaireRéseau,
    'gestionnaire-réseau': grd,
    miseEnService,
  }: RaccordementEntity & Joined<LeftJoin<GestionnaireRéseau.GestionnaireRéseauEntity>>,
  dossiers: ReadonlyArray<DossierRaccordementEntity>,
): ConsulterRaccordementReadModel => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    gestionnaireRéseau: grd
      ? {
          raisonSociale: grd.raisonSociale,
          contactEmail: grd.contactEmail ? Email.convertirEnValueType(grd.contactEmail) : undefined,
        }
      : Option.none,
    dossiers: dossiers.map(mapToDossierRaccordementReadModel),
    miseEnService: miseEnService
      ? {
          date: DateTime.convertirEnValueType(miseEnService.date),
          référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(
            miseEnService.référenceDossierRaccordement,
          ),
        }
      : undefined,
  };
};
