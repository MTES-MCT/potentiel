import { Message, MessageHandler, mediator } from 'mediateur';

import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { GetProjetUtilisateurScope, IdentifiantProjet } from '../../..';
import { LauréatEntity, Raccordement } from '../..';
import { CandidatureEntity, Localité } from '../../../candidature';
import { DossierRaccordementEntity, RaccordementEntity } from '../../raccordement';
import { PuissanceEntity } from '../../puissance';

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
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

type ProjetAvecAchevementATransmettreJoins = [
  RaccordementEntity,
  CandidatureEntity,
  DossierRaccordementEntity,
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
    } = await list<LauréatEntity, ProjetAvecAchevementATransmettreJoins>('lauréat', {
      where: {
        appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
        période: Where.equal(periode),
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        localité: {
          région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined,
        },
        statut: Where.notEqual('achevé'),
      },
      join: [
        {
          entity: 'raccordement',
          on: 'identifiantProjet',
          where: {
            identifiantGestionnaireRéseau:
              scope.type === 'gestionnaire-réseau'
                ? Where.equal(scope.identifiantGestionnaireRéseau)
                : undefined,
          },
        },
        {
          entity: 'candidature',
          on: 'identifiantProjet',
        },
        {
          entity: 'dossier-raccordement',
          on: 'identifiantProjet',
          joinKey: 'identifiantProjet',
        },
        {
          entity: 'puissance',
          on: 'identifiantProjet',
        },
      ],
      orderBy: {
        identifiantProjet: 'ascending',
      },
      range,
    });

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
  projet: LauréatEntity & Joined<ProjetAvecAchevementATransmettreJoins>,
) => ProjetAvecAchevementATransmettre | undefined;

export const mapToReadModel: MapToReadModelProps = ({
  identifiantProjet,
  candidature: { prixReference, coefficientKChoisi, puissance: puissanceInitiale },
  localité,
  nomProjet,
  notifiéLe,
  raccordement: { identifiantGestionnaireRéseau },
  'dossier-raccordement': dossier,
  puissance: { puissance },
}) => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    nomProjet,
    identifiantGestionnaireReseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(
        identifiantGestionnaireRéseau,
      ),
    référenceDossierRaccordement: Raccordement.RéférenceDossierRaccordement.convertirEnValueType(
      dossier.référence,
    ),
    dateDCR: dossier.demandeComplèteRaccordement?.dateQualification
      ? DateTime.convertirEnValueType(dossier.demandeComplèteRaccordement.dateQualification)
      : undefined,
    localité: Localité.bind(localité),
    prix: prixReference,
    coefficientKChoisi: !!coefficientKChoisi,
    dateNotification: DateTime.convertirEnValueType(notifiéLe),
    puissance,
    puissanceInitiale,
  };
};
