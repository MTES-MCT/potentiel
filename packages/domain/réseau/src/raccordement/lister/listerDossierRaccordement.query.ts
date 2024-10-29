import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/laureat';
import { Candidature } from '@potentiel-domain/candidature';
import { Abandon } from '@potentiel-domain/laureat';

import { RéférenceDossierRaccordement } from '..';
import { DossierRaccordementEntity } from '../raccordement.entity';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';

type DossierRaccordement = {
  nomProjet: string;
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  commune: string;
  département: string;
  région: string;
  codePostal: string;
  référenceDossier: RéférenceDossierRaccordement.ValueType;
  statutDGEC: Lauréat.StatutLauréat.RawType;
  dateMiseEnService?: DateTime.ValueType;
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
};

export type ListerDossierRaccordementReadModel = {
  items: Array<DossierRaccordement>;
  range: RangeOptions;
  total: number;
};

export type ListerDossierRaccordementQuery = Message<
  'Réseau.Raccordement.Query.ListerDossierRaccordementQuery',
  {
    identifiantGestionnaireRéseau?: string;
    appelOffre?: string;
    avecDateMiseEnService?: boolean;
    range?: RangeOptions;
    référenceDossier?: string;
  },
  ListerDossierRaccordementReadModel
>;

export type ListerDossierRaccordementQueryDependencies = {
  list: List;
};

export const registerListerDossierRaccordementQuery = ({
  list,
}: ListerDossierRaccordementQueryDependencies) => {
  const handler: MessageHandler<ListerDossierRaccordementQuery> = async ({
    identifiantGestionnaireRéseau,
    appelOffre,
    avecDateMiseEnService,
    référenceDossier,
    range,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<DossierRaccordementEntity>('dossier-raccordement', {
      where: {
        référence: Where.contains(référenceDossier),
        identifiantGestionnaireRéseau: Where.equal(identifiantGestionnaireRéseau),
        appelOffre: Where.equal(appelOffre),
        miseEnService: {
          dateMiseEnService:
            avecDateMiseEnService === undefined
              ? undefined
              : avecDateMiseEnService
                ? Where.notEqualNull()
                : Where.equalNull(),
        },
      },
      orderBy: {
        référence: 'ascending',
      },
      range,
    });

    const identifiants = items.map(
      (dossier) => dossier.identifiantProjet as IdentifiantProjet.RawType,
    );

    const candidatures = await list<Candidature.CandidatureEntity>('candidature', {
      where: {
        identifiantProjet: Where.include(identifiants),
      },
    });

    const abandons = await list<Abandon.AbandonEntity>('abandon', {
      where: {
        identifiantProjet: Where.include(identifiants),
      },
    });

    return {
      items: items.map((item) => toReadModel(item, candidatures.items, abandons.items)),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };

  mediator.register('Réseau.Raccordement.Query.ListerDossierRaccordementQuery', handler);
};

export const toReadModel = (
  {
    identifiantProjet,
    référence,
    miseEnService,
    identifiantGestionnaireRéseau,
  }: DossierRaccordementEntity,
  candidatures: ReadonlyArray<Candidature.CandidatureEntity>,
  abandons: ReadonlyArray<Abandon.AbandonEntity>,
): DossierRaccordement => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const candidature = candidatures.find(
    (candidature) => candidature.identifiantProjet === identifiantProjet,
  );
  const abandon = abandons.find((abandons) => abandons.identifiantProjet === identifiantProjet);

  const { nomProjet, codePostal, commune, département, région } = match(candidature)
    .with(undefined, () => ({
      codePostal: 'Code postal inconnu',
      commune: 'Commune inconnue',
      nomProjet: 'Nom projet inconnu',
      département: 'Département inconnu',
      région: 'Région inconnue',
    }))
    .otherwise((value) => ({
      codePostal: value.localité.codePostal,
      commune: value.localité.commune,
      nomProjet: value.nomProjet,
      département: value.localité.département,
      région: value.localité.région,
    }));

  return {
    appelOffre,
    codePostal,
    commune,
    département,
    région,
    famille,
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    numéroCRE,
    période,
    référenceDossier: RéférenceDossierRaccordement.convertirEnValueType(référence),
    statutDGEC: match(abandon)
      .with(undefined, () => Lauréat.StatutLauréat.classé.formatter())
      .otherwise(() => Lauréat.StatutLauréat.abandonné.formatter()),
    dateMiseEnService: miseEnService
      ? DateTime.convertirEnValueType(miseEnService.dateMiseEnService)
      : undefined,
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseau,
    ),
  };
};
