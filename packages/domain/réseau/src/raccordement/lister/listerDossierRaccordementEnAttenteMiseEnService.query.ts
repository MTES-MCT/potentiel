import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/laureat';
import { Candidature } from '@potentiel-domain/candidature';

import { RéférenceDossierRaccordement } from '..';
import { DossierRaccordementEntity } from '../raccordement.entity';

type DossierRaccordementEnAttenteMiseEnService = {
  nomProjet: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  commune: string;
  codePostal: string;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  statutDGEC: Lauréat.StatutLauréat.RawType;
};

export type ListerDossierRaccordementEnAttenteMiseEnServiceReadModel = {
  items: Array<DossierRaccordementEnAttenteMiseEnService>;
  range: RangeOptions;
  total: number;
};

export type ListerDossierRaccordementEnAttenteMiseEnServiceQuery = Message<
  'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
  {
    identifiantGestionnaireRéseau: string;
    projetNotifiéAvant?: DateTime.RawType;
    range?: RangeOptions;
  },
  ListerDossierRaccordementEnAttenteMiseEnServiceReadModel
>;

export type ConsulterDossierRaccordementDependencies = {
  list: List;
};

export const registerListerDossierRaccordementEnAttenteMiseEnServiceQuery = ({
  list,
}: ConsulterDossierRaccordementDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementEnAttenteMiseEnServiceQuery> = async ({
    identifiantGestionnaireRéseau,
    projetNotifiéAvant,
    range,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
        miseEnService: {
          dateMiseEnService: Where.equalNull(),
        },
        projetNotifiéLe: Where.lessOrEqual(projetNotifiéAvant),
      },
      range,
      orderBy: {
        référence: 'ascending',
      },
    });

    const identifiants = items.map(
      (dossier) => dossier.identifiantProjet as IdentifiantProjet.RawType,
    );

    const candidatures = await list<Candidature.CandidatureEntity>('candidature', {
      where: {
        identifiantProjet: Where.include(identifiants),
      },
    });

    return {
      items: items.map((item) => toReadModel(item, candidatures.items)),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };

  mediator.register(
    'Réseau.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
    handler,
  );
};

export const toReadModel = (
  { identifiantProjet, référence }: DossierRaccordementEntity,
  candidatures: ReadonlyArray<Candidature.CandidatureEntity>,
): DossierRaccordementEnAttenteMiseEnService => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const candidature = candidatures.find(
    (candidature) => candidature.identifiantProjet === identifiantProjet,
  );

  const { nomProjet, codePostal, commune } = match(candidature)
    .with(undefined, () => ({
      codePostal: 'Code postal inconnu',
      commune: 'Commune inconnue',
      nomProjet: 'Nom projet inconnu',
    }))
    .otherwise((value) => ({
      codePostal: value.localité.codePostal,
      commune: value.localité.commune,
      nomProjet: value.nomProjet,
    }));

  return {
    appelOffre,
    codePostal,
    commune,
    famille,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    numéroCRE,
    période,
    référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référence),
    statutDGEC: Lauréat.StatutLauréat.classé.formatter(),
  };
};
