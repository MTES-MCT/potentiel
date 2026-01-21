import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, LeftJoin, List, Where } from '@potentiel-domain/entity';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { LauréatEntity } from '../lauréat.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import {
  CandidatureEntity,
  Dépôt,
  DétailCandidature,
  DétailCandidatureEntity,
  Localité,
  UnitéPuissance,
} from '../../candidature';
import { PuissanceEntity } from '../puissance';
import { Actionnaire, StatutLauréat } from '..';
import { AbandonEntity } from '../abandon';
import { AchèvementEntity } from '../achèvement';
import { ActionnaireEntity } from '../actionnaire';
import { RaccordementEntity } from '../raccordement';

type LauréatEnrichiListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  période: IdentifiantProjet.ValueType['période'];
  famille?: IdentifiantProjet.ValueType['famille'];
  numéroCRE: IdentifiantProjet.ValueType['numéroCRE'];
  nomProjet: Dépôt.ValueType['nomProjet'];
  statut: StatutLauréat.ValueType;

  adresse1: Localité.ValueType['adresse1'];
  adresse2: Localité.ValueType['adresse2'];
  commune: Localité.ValueType['commune'];
  codePostal: Localité.ValueType['codePostal'];
  département: Localité.ValueType['département'];
  région: Localité.ValueType['région'];

  actionnaire: Actionnaire.ConsulterActionnaireReadModel['actionnaire'];

  raisonSocialeGestionnaireRéseau?: GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel['raisonSociale'];

  dateAchèvementPrévisionnelle?: DateTime.ValueType;
  dateAchèvementRéelle?: DateTime.ValueType;

  prixReference: Dépôt.ValueType['prixReference'];
  puissance: Dépôt.ValueType['puissance'];
  unitéPuissance: UnitéPuissance.ValueType;

  technologieÉolien?: DétailCandidature.RawType[number];
  diamètreRotorEnMètres?: DétailCandidature.RawType[number];
  hauteurBoutDePâleEnMètres?: DétailCandidature.RawType[number];
  installationRenouvellée?: DétailCandidature.RawType[number];
  nombreDAérogénérateurs?: DétailCandidature.RawType[number];
  puissanceUnitaireDesAérogénérateurs?: DétailCandidature.RawType[number];
};

export type ListerLauréatEnrichiReadModel = {
  items: ReadonlyArray<LauréatEnrichiListItemReadModel>;
};

export type ListerLauréatEnrichiQuery = Message<
  'Lauréat.Query.ListerLauréatEnrichi',
  {
    utilisateur: Email.RawType;
    statut?: StatutLauréat.RawType;
    appelOffre?: string;
    periode?: string;
    famille?: string;
  },
  ListerLauréatEnrichiReadModel
>;

export type ListerLauréatEnrichiDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerLauréatEnrichiQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerLauréatEnrichiDependencies) => {
  const handler: MessageHandler<ListerLauréatEnrichiQuery> = async ({
    utilisateur,
    appelOffre,
    periode,
    famille,
    statut,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const lauréats = await list<
      LauréatEntity,
      [
        CandidatureEntity,
        PuissanceEntity,
        ActionnaireEntity,
        LeftJoin<AchèvementEntity>,
        LeftJoin<AbandonEntity>,
        DétailCandidatureEntity,
        LeftJoin<RaccordementEntity>,
      ]
    >('lauréat', {
      orderBy: {
        appelOffre: 'ascending',
        période: 'ascending',
        famille: 'ascending',
      },
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        appelOffre: Where.equal(appelOffre),
        période: Where.equal(periode),
        famille: Where.equal(famille),
        localité: { région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined },
      },
      join: [
        {
          entity: 'candidature',
          on: 'identifiantProjet',
        },
        {
          entity: 'puissance',
          on: 'identifiantProjet',
        },
        {
          entity: 'actionnaire',
          on: 'identifiantProjet',
        },
        {
          entity: 'achèvement',
          on: 'identifiantProjet',
          type: 'left',
          where:
            statut === 'achevé'
              ? { estAchevé: Where.equal(true) }
              : statut === 'actif'
                ? { estAchevé: Where.equal(false) }
                : undefined,
        },
        {
          entity: 'abandon',
          on: 'identifiantProjet',
          type: 'left',
          where:
            statut === 'abandonné'
              ? { estAbandonné: Where.equal(true) }
              : statut === 'actif'
                ? { estAbandonné: Where.notEqual(true) }
                : undefined,
        },
        {
          entity: 'détail-candidature',
          on: 'identifiantProjet',
        },
        { entity: 'raccordement', on: 'identifiantProjet', type: 'left' },
      ],
    });

    const gestionnairesRéseau = await list<GestionnaireRéseau.GestionnaireRéseauEntity>(
      'gestionnaire-réseau',
      { select: ['raisonSociale', 'codeEIC'] },
    );

    const gestionnaireRéseauMap = new Map(
      gestionnairesRéseau.items.map((gr) => [gr.codeEIC, gr.raisonSociale]),
    );

    return {
      items: lauréats.items.map((lauréat) =>
        mapToReadModel({
          lauréat,
          gestionnaireRéseau: lauréat.raccordement
            ? gestionnaireRéseauMap.get(lauréat.raccordement.identifiantGestionnaireRéseau)
            : undefined,
        }),
      ),
    };
  };

  mediator.register('Lauréat.Query.ListerLauréatEnrichi', handler);
};

type MapToReadModelProps = (args: {
  gestionnaireRéseau?: GestionnaireRéseau.GestionnaireRéseauEntity['raisonSociale'];
  lauréat: LauréatEntity &
    Joined<
      [
        CandidatureEntity,
        PuissanceEntity,
        ActionnaireEntity,
        LeftJoin<AchèvementEntity>,
        LeftJoin<AbandonEntity>,
        LeftJoin<RaccordementEntity>,
        DétailCandidatureEntity,
      ]
    >;
}) => LauréatEnrichiListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  lauréat: {
    nomProjet,
    identifiantProjet,
    localité,
    puissance,
    candidature: { prixReference, unitéPuissance },
    abandon,
    achèvement,
    actionnaire,
    'détail-candidature': détailCandidature,
  },
  gestionnaireRéseau,
}) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const statutValueType = abandon?.estAbandonné
    ? StatutLauréat.abandonné
    : achèvement?.estAchevé
      ? StatutLauréat.achevé
      : StatutLauréat.actif;

  return {
    identifiantProjet: identifiantProjetValueType,
    appelOffre: identifiantProjetValueType.appelOffre,
    période: identifiantProjetValueType.période,
    famille: identifiantProjetValueType.famille,
    numéroCRE: identifiantProjetValueType.numéroCRE,
    nomProjet,
    statut: statutValueType,
    ...localité,

    actionnaire: actionnaire.actionnaire.nom,

    raisonSocialeGestionnaireRéseau: gestionnaireRéseau,

    dateAchèvementPrévisionnelle:
      achèvement && DateTime.convertirEnValueType(achèvement.prévisionnel.date),
    dateAchèvementRéelle: achèvement?.réel && DateTime.convertirEnValueType(achèvement.réel.date),

    prixReference,
    puissance: puissance.puissance,
    unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissance),

    technologieÉolien: détailCandidature.détail['Technologie (AO éolien)'],
    diamètreRotorEnMètres: détailCandidature.détail['Diamètre du rotor (m) (AO éolien)'],
    hauteurBoutDePâleEnMètres: détailCandidature.détail['Hauteur bout de pâle (m) (AO éolien)'],
    installationRenouvellée: détailCandidature.détail['Installation renouvellée (AO éolien)'],
    nombreDAérogénérateurs: détailCandidature.détail["Nb d'aérogénérateurs (AO éolien)"],
    puissanceUnitaireDesAérogénérateurs:
      détailCandidature.détail['Puissance unitaire des aérogénérateurs (AO éolien)'],
  };
};
