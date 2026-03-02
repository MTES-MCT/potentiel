import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { GetScopeProjetUtilisateur, IdentifiantProjet } from '../../../index.js';
import { LauréatEntity, Raccordement } from '../../index.js';
import { CandidatureEntity, Localité } from '../../../candidature/index.js';
import { DossierRaccordementEntity, RaccordementEntity } from '../../raccordement/index.js';
import { PuissanceEntity } from '../../puissance/index.js';

type ProjetAvecAchevementATransmettre = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantGestionnaireReseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.ValueType;
  référenceDossierRaccordement: Raccordement.RéférenceDossierRaccordement.ValueType;
  dateDCR?: DateTime.ValueType;
  nomProjet: string;
  prix: number;
  coefficientKChoisi: boolean;
  dateNotification: DateTime.ValueType;
  localité: Localité.ValueType;
  puissance: number;
  puissanceInitiale: number;
};

export type ListerProjetAvecAchevementATransmettreReadModel = {
  items: Array<ProjetAvecAchevementATransmettre>;
  range: RangeOptions;
  total: number;
};

export type ListerProjetAvecAchevementATransmettreQuery = Message<
  'Lauréat.Achevement.Query.ListerProjetAvecAchevementATransmettre',
  {
    appelOffre?: Array<string>;
    periode?: string;
    range?: RangeOptions;
    identifiantUtilisateur: Email.RawType;
  },
  ListerProjetAvecAchevementATransmettreReadModel
>;

export type ListerProjetAvecAchevementATransmettreDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

type ProjetAvecAchevementATransmettreJoins = [
  LauréatEntity,
  RaccordementEntity,
  CandidatureEntity,
  PuissanceEntity,
];
export const registerListerProjetAvecAchevementATransmettreQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerProjetAvecAchevementATransmettreDependencies) => {
  const handler: MessageHandler<ListerProjetAvecAchevementATransmettreQuery> = async ({
    appelOffre,
    periode,
    range,
    identifiantUtilisateur,
  }) => {
    const scope = await getScopeProjetUtilisateur(
      Email.convertirEnValueType(identifiantUtilisateur),
    );

    const {
      items: projets,
      range: { endPosition, startPosition },
      total: totalProjet,
    } = await list<DossierRaccordementEntity, ProjetAvecAchevementATransmettreJoins>(
      'dossier-raccordement',
      {
        where: {
          identifiantProjet: Where.matchAny(scope.identifiantProjets),
        },
        join: [
          {
            entity: 'lauréat',
            on: 'identifiantProjet',
            where: {
              appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
              période: Where.equal(periode),
              localité: {
                région: Where.matchAny(scope.régions),
              },
              statut: Where.notEqual('achevé'),
            },
          },
          {
            entity: 'raccordement',
            on: 'identifiantProjet',
            where: {
              identifiantGestionnaireRéseau: Where.equal(scope.identifiantGestionnaireRéseau),
            },
          },
          {
            entity: 'candidature',
            on: 'identifiantProjet',
          },
          {
            entity: 'puissance',
            on: 'identifiantProjet',
          },
        ],
        orderBy: {
          identifiantProjet: 'ascending',
          référence: 'ascending',
        },
        range,
      },
    );

    if (totalProjet === 0) {
      return {
        items: [],
        range: {
          endPosition: 0,
          startPosition: 0,
        },
        total: 0,
      };
    }

    const items = projets
      .map((projet) => mapToReadModel(projet))
      .filter((item) => item !== undefined);

    return {
      items,
      range: {
        endPosition,
        startPosition,
      },
      total: totalProjet,
    };
  };

  mediator.register('Lauréat.Achevement.Query.ListerProjetAvecAchevementATransmettre', handler);
};

type MapToReadModelProps = (
  projet: DossierRaccordementEntity & Joined<ProjetAvecAchevementATransmettreJoins>,
) => ProjetAvecAchevementATransmettre | undefined;

export const mapToReadModel: MapToReadModelProps = ({
  identifiantProjet,
  référence,
  demandeComplèteRaccordement,
  candidature: { prixReference, coefficientKChoisi, puissance: puissanceInitiale },
  lauréat: { localité, nomProjet, notifiéLe },
  raccordement: { identifiantGestionnaireRéseau },
  puissance: { puissance },
}) => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    identifiantGestionnaireReseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    référenceDossierRaccordement:
      Raccordement.RéférenceDossierRaccordement.convertirEnValueType(référence),
    dateDCR: demandeComplèteRaccordement?.dateQualification
      ? DateTime.convertirEnValueType(demandeComplèteRaccordement.dateQualification)
      : undefined,
    localité: Localité.bind(localité),
    prix: prixReference,
    coefficientKChoisi: !!coefficientKChoisi,
    dateNotification: DateTime.convertirEnValueType(notifiéLe),
    puissance,
    puissanceInitiale,
  };
};
