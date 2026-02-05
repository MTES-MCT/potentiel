import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, LeftJoin, List, Where } from '@potentiel-domain/entity';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';

import { LauréatEntity } from '../lauréat.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import {
  CandidatureEntity,
  Dépôt,
  DétailCandidatureEntity,
  Localité,
  TypeActionnariat,
  UnitéPuissance,
} from '../../candidature';
import { PuissanceEntity } from '../puissance';
import { Actionnaire, StatutLauréat } from '..';
import { AchèvementEntity } from '../achèvement';
import { ActionnaireEntity } from '../actionnaire';
import { RaccordementEntity } from '../raccordement';

export type LauréatEnrichiListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  période: IdentifiantProjet.ValueType['période'];
  famille: IdentifiantProjet.ValueType['famille'] | undefined;
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

  typeActionnariat: TypeActionnariat.ValueType | undefined;

  raisonSocialeGestionnaireRéseau:
    | GestionnaireRéseau.ConsulterGestionnaireRéseauReadModel['raisonSociale']
    | undefined;

  dateAchèvementPrévisionnelle: DateTime.ValueType | undefined;
  dateAchèvementRéelle: DateTime.ValueType | undefined;

  prixReference: Dépôt.ValueType['prixReference'];
  puissance: Dépôt.ValueType['puissance'];
  unitéPuissance: UnitéPuissance.ValueType;

  technologieÉolien: string | undefined;
  diamètreRotorEnMètres: string | undefined;
  hauteurBoutDePâleEnMètres: string | undefined;
  installationRenouvellée: string | undefined;
  nombreDAérogénérateurs: string | undefined;
  puissanceUnitaireDesAérogénérateurs: string | undefined;
};

export type ListerLauréatEnrichiReadModel = {
  items: ReadonlyArray<LauréatEnrichiListItemReadModel>;
};

export type ListerLauréatEnrichiQuery = Message<
  'Lauréat.Query.ListerLauréatEnrichi',
  {
    utilisateur: Email.RawType;
    statut?: Array<StatutLauréat.RawType>;
    appelOffre?: Array<string>;
    periode?: string;
    famille?: string;
    identifiantProjet?: IdentifiantProjet.RawType;
    typeActionnariat?: Array<TypeActionnariat.RawType>;
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
    identifiantProjet,
    statut,
    typeActionnariat,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const identifiantProjets =
      scope.type === 'projet'
        ? identifiantProjet
          ? scope.identifiantProjets.filter((id) => id === identifiantProjet)
          : scope.identifiantProjets
        : identifiantProjet
          ? [identifiantProjet]
          : undefined;

    const lauréats = await list<
      LauréatEntity,
      [
        CandidatureEntity,
        PuissanceEntity,
        ActionnaireEntity,
        AchèvementEntity,
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
        identifiantProjet: Where.matchAny(identifiantProjets),
        appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
        statut: statut?.length ? Where.matchAny(statut) : undefined,
        période: Where.equal(periode),
        famille: Where.equal(famille),
        localité: { région: scope.type === 'région' ? Where.matchAny(scope.régions) : undefined },
      },
      join: [
        {
          entity: 'candidature',
          on: 'identifiantProjet',
          where: {
            actionnariat:
              typeActionnariat && typeActionnariat.length > 0
                ? Where.matchAny(typeActionnariat)
                : undefined,
          },
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
        AchèvementEntity,
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
    statut,
    puissance,
    candidature: { prixReference, unitéPuissance, actionnariat },
    achèvement,
    actionnaire,
    'détail-candidature': détailCandidature,
  },
  gestionnaireRéseau,
}) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  const statutValueType = StatutLauréat.convertirEnValueType(statut);

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

    typeActionnariat: actionnariat
      ? TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined,

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
