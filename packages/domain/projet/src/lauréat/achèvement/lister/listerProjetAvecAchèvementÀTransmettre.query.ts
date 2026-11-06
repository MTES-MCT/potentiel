import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import {
  type Joined,
  type LeftJoin,
  type List,
  type RangeOptions,
  Where,
} from '@potentiel-domain/entity';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import type { AccèsEntity } from '../../../accès/accès.entity.js';
import {
  type CandidatureEntity,
  type DétailCandidatureEntity,
  Localité,
} from '../../../candidature/index.js';
import { Candidature, type GetScopeProjetUtilisateur, IdentifiantProjet } from '../../../index.js';
import { type LauréatEntity, Raccordement } from '../../index.js';
import type { InstallationEntity } from '../../installation/installation.entity.js';
import type { PowerPurchaseAgreementEntity } from '../../power-purchase-agreement/powerPurchaseAgreement.entity.js';
import type { PuissanceEntity } from '../../puissance/index.js';
import type { DossierRaccordementEntity, RaccordementEntity } from '../../raccordement/index.js';

type ProjetAvecAchèvementÀTransmettre = {
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
  presenceDeTrackers?: boolean;
  emailPorteurs: Array<Email.ValueType>;
  typologieInstallation: Array<Candidature.TypologieInstallation.ValueType>;
};

export type ListerProjetAvecAchèvementÀTransmettreReadModel = {
  items: Array<ProjetAvecAchèvementÀTransmettre>;
  range: RangeOptions;
  total: number;
};

export type ListerProjetAvecAchèvementÀTransmettreQuery = Message<
  'Lauréat.Achèvement.Query.ListerProjetAvecAchèvementÀTransmettre',
  {
    appelOffre?: Array<string>;
    periode?: string;
    range?: RangeOptions;
    identifiantUtilisateur: Email.RawType;
  },
  ListerProjetAvecAchèvementÀTransmettreReadModel
>;

export type ListerProjetAvecAchèvementÀTransmettreDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
};

type ProjetAvecAchèvementÀTransmettreJoins = [
  LauréatEntity,
  RaccordementEntity,
  CandidatureEntity,
  DétailCandidatureEntity,
  PuissanceEntity,
  LeftJoin<AccèsEntity>,
  LeftJoin<PowerPurchaseAgreementEntity>,
  LeftJoin<InstallationEntity>,
];
export const registerListerProjetAvecAchèvementÀTransmettreQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerProjetAvecAchèvementÀTransmettreDependencies) => {
  const handler: MessageHandler<ListerProjetAvecAchèvementÀTransmettreQuery> = async ({
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
    } = await list<DossierRaccordementEntity, ProjetAvecAchèvementÀTransmettreJoins>(
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
              désactivé: Where.notEqual(true),
            },
          },
          {
            entity: 'candidature',
            on: 'identifiantProjet',
          },
          {
            entity: 'détail-candidature',
            on: 'identifiantProjet',
          },

          {
            entity: 'puissance',
            on: 'identifiantProjet',
          },
          { entity: 'accès', type: 'left', on: 'identifiantProjet' },
          {
            entity: 'power-purchase-agreement',
            on: 'identifiantProjet',
            type: 'left',
            where: { signaléLe: Where.equalNull() },
          },
          {
            entity: 'installation',
            on: 'identifiantProjet',
            type: 'left',
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

  mediator.register('Lauréat.Achèvement.Query.ListerProjetAvecAchèvementÀTransmettre', handler);
};

type MapToReadModelProps = (
  projet: DossierRaccordementEntity & Joined<ProjetAvecAchèvementÀTransmettreJoins>,
) => ProjetAvecAchèvementÀTransmettre | undefined;

export const mapToReadModel: MapToReadModelProps = ({
  identifiantProjet,
  référence,
  demandeComplèteRaccordement,
  candidature: { prixReference, coefficientKChoisi, puissance: puissanceInitiale },
  'détail-candidature': { pv },
  lauréat: { localité, nomProjet, notifiéLe },
  raccordement: { identifiantGestionnaireRéseau },
  puissance: { puissance },
  accès,
  installation,
}) => ({
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
  presenceDeTrackers: pv?.trackers,
  emailPorteurs:
    accès?.utilisateursAyantAccès.map((utilisateur) => Email.convertirEnValueType(utilisateur)) ??
    [],
  typologieInstallation:
    installation?.typologieInstallation?.map(
      Candidature.TypologieInstallation.convertirEnValueType,
    ) ?? [],
});
