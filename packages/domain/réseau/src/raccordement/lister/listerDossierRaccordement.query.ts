import { Message, MessageHandler, mediator } from 'mediateur';
import { match } from 'ts-pattern';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/laureat';
import { Candidature } from '@potentiel-domain/candidature';

import { RéférenceDossierRaccordement } from '..';
import { DossierRaccordementEntity } from '../raccordement.entity';
import { IdentifiantGestionnaireRéseau } from '../../gestionnaire';
import { GestionnaireRéseau } from '../..';

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
  raisonSocialeGestionnaireRéseau: string;
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
    région?: string;
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
    région,
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
        région: Where.equal(région),
      },
      orderBy: {
        référence: 'ascending',
      },
      range,
    });

    const identifiantsProjet = items.map(
      (dossier) => dossier.identifiantProjet as IdentifiantProjet.RawType,
    );

    const identifiantsGestionnaireRéseau = items.map(
      (dossier) => dossier.identifiantGestionnaireRéseau as IdentifiantGestionnaireRéseau.RawType,
    );

    const candidatures = await list<Candidature.CandidatureEntity>('candidature', {
      where: {
        identifiantProjet: Where.include(identifiantsProjet),
      },
    });

    const gestionnairesRéseau = await list<GestionnaireRéseau.GestionnaireRéseauEntity>(
      'gestionnaire-réseau',
      {
        where: {
          codeEIC: Where.include(identifiantsGestionnaireRéseau),
        },
      },
    );

    return {
      items: items.map((item) => toReadModel(item, candidatures.items, gestionnairesRéseau.items)),
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
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseau.GestionnaireRéseauEntity>,
): DossierRaccordement => {
  const { appelOffre, famille, numéroCRE, période } =
    IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const candidature = candidatures.find(
    (candidature) => candidature.identifiantProjet === identifiantProjet,
  );
  const gestionnaire = gestionnairesRéseau.find(
    (gestionnaireRéseau) => gestionnaireRéseau.codeEIC === identifiantGestionnaireRéseau,
  );

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
    statutDGEC: Lauréat.StatutLauréat.classé.formatter(),
    dateMiseEnService: miseEnService
      ? DateTime.convertirEnValueType(miseEnService.dateMiseEnService)
      : undefined,
    identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseau,
    ),
    raisonSocialeGestionnaireRéseau: match(gestionnaire)
      .with(undefined, () => 'Gestionnaire réseau inconnu')
      .otherwise((value) => value.raisonSociale),
  };
};
