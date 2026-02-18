import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { Joined, List, Where } from '@potentiel-domain/entity';

import { ÉliminéEntity } from '../éliminé.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import {
  CandidatureEntity,
  Dépôt,
  DétailCandidatureEntity,
  Localité,
  TypeActionnariat,
  TypologieInstallation,
  UnitéPuissance,
} from '../../candidature';
import { DispositifDeStockage } from '../../lauréat/installation';
import {
  TypeDeNatureDeLExploitation,
  NatureDeLExploitationEntity,
} from '../../lauréat/nature-de-l-exploitation';

export type ÉliminéEnrichiListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  période: IdentifiantProjet.ValueType['période'];
  famille: IdentifiantProjet.ValueType['famille'] | undefined;
  numéroCRE: IdentifiantProjet.ValueType['numéroCRE'];
  nomProjet: Dépôt.ValueType['nomProjet'];

  adresse1: Localité.ValueType['adresse1'];
  adresse2: Localité.ValueType['adresse2'];
  commune: Localité.ValueType['commune'];
  codePostal: Localité.ValueType['codePostal'];
  département: Localité.ValueType['département'];
  région: Localité.ValueType['région'];

  actionnaire: string;

  typeActionnariat: TypeActionnariat.ValueType | undefined;

  prixReference: Dépôt.ValueType['prixReference'];
  numéroAutorisationDUrbanisme: string | undefined;

  puissance: Dépôt.ValueType['puissance'];
  puissanceDeSite: Dépôt.ValueType['puissanceDeSite'];
  unitéPuissance: UnitéPuissance.ValueType;

  coefficientKChoisi: Dépôt.ValueType['coefficientKChoisi'];
  typologieInstallation: Array<TypologieInstallation.ValueType> | undefined;
  installateur: Dépôt.ValueType['installateur'];
  installationAvecDispositifDeStockage:
    | DispositifDeStockage.ValueType['installationAvecDispositifDeStockage']
    | undefined;
  puissanceDuDispositifDeStockageEnKW:
    | DispositifDeStockage.ValueType['puissanceDuDispositifDeStockageEnKW']
    | undefined;
  capacitéDuDispositifDeStockageEnKWh:
    | DispositifDeStockage.ValueType['puissanceDuDispositifDeStockageEnKW']
    | undefined;
  typeNatureDeLExploitation: TypeDeNatureDeLExploitation.ValueType | undefined;
  tauxPrévisionnelACI: NatureDeLExploitationEntity['tauxPrévisionnelACI'] | undefined;

  technologieÉolien: string | undefined;
  diamètreRotorEnMètres: string | undefined;
  hauteurBoutDePâleEnMètres: string | undefined;
  installationRenouvellée: string | undefined;
  nombreDAérogénérateurs: string | undefined;
  puissanceUnitaireDesAérogénérateurs: string | undefined;
};

export type ListerÉliminéEnrichiReadModel = {
  items: ReadonlyArray<ÉliminéEnrichiListItemReadModel>;
};

export type ListerÉliminéEnrichiQuery = Message<
  'Éliminé.Query.ListerÉliminéEnrichi',
  {
    utilisateur: Email.RawType;
    appelOffre?: Array<string>;
    periode?: string;
    famille?: string;
    identifiantProjet?: IdentifiantProjet.RawType;
    typeActionnariat?: Array<TypeActionnariat.RawType>;
  },
  ListerÉliminéEnrichiReadModel
>;

export type ListerÉliminéEnrichiDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerÉliminéEnrichiQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerÉliminéEnrichiDependencies) => {
  const handler: MessageHandler<ListerÉliminéEnrichiQuery> = async ({
    utilisateur,
    appelOffre,
    periode,
    famille,
    identifiantProjet,
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

    console.log({ identifiantProjets }, scope, utilisateur);

    const éliminés = await list<CandidatureEntity, [ÉliminéEntity, DétailCandidatureEntity]>(
      'candidature',
      {
        orderBy: {
          identifiantProjet: 'ascending',
        },
        where: {
          identifiantProjet: Where.matchAny(identifiantProjets),
          appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
          période: Where.equal(periode),
          famille: Where.equal(famille),
          localité: scope.type === 'région' ? { région: Where.matchAny(scope.régions) } : undefined,
          actionnariat:
            typeActionnariat && typeActionnariat.length > 0
              ? Where.matchAny(typeActionnariat)
              : undefined,
        },
        join: [
          {
            entity: 'éliminé',
            on: 'identifiantProjet',
          },
          {
            entity: 'détail-candidature',
            on: 'identifiantProjet',
          },
        ],
      },
    );

    return {
      items: éliminés.items.map((éliminé) => mapToReadModel(éliminé)),
    };
  };

  mediator.register('Éliminé.Query.ListerÉliminéEnrichi', handler);
};

type MapToReadModelProps = (
  args: CandidatureEntity & Joined<[ÉliminéEntity, DétailCandidatureEntity]>,
) => ÉliminéEnrichiListItemReadModel;

const mapToReadModel: MapToReadModelProps = ({
  nomProjet,
  identifiantProjet,
  localité,
  puissance,
  puissanceDeSite,
  prixReference,
  unitéPuissance,
  actionnariat,
  sociétéMère,
  coefficientKChoisi,
  autorisationDUrbanisme,
  installateur,
  dispositifDeStockage,
  typologieInstallation,
  natureDeLExploitation,

  'détail-candidature': détailCandidature,
}) => {
  const identifiantProjetValueType = IdentifiantProjet.convertirEnValueType(identifiantProjet);

  const dispositifDeStockageValueType = dispositifDeStockage
    ? DispositifDeStockage.convertirEnValueType(dispositifDeStockage)
    : undefined;

  return {
    identifiantProjet: identifiantProjetValueType,
    appelOffre: identifiantProjetValueType.appelOffre,
    période: identifiantProjetValueType.période,
    famille: identifiantProjetValueType.famille,
    numéroCRE: identifiantProjetValueType.numéroCRE,
    nomProjet,
    ...localité,

    actionnaire: sociétéMère,

    typeActionnariat: actionnariat
      ? TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined,

    prixReference,
    coefficientKChoisi,
    numéroAutorisationDUrbanisme: autorisationDUrbanisme?.numéro,

    puissance,
    puissanceDeSite,
    unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissance),

    installateur,
    installationAvecDispositifDeStockage:
      dispositifDeStockageValueType?.installationAvecDispositifDeStockage,
    puissanceDuDispositifDeStockageEnKW:
      dispositifDeStockageValueType?.puissanceDuDispositifDeStockageEnKW,
    capacitéDuDispositifDeStockageEnKWh:
      dispositifDeStockageValueType?.capacitéDuDispositifDeStockageEnKWh,
    typologieInstallation: typologieInstallation.map(TypologieInstallation.convertirEnValueType),
    typeNatureDeLExploitation: natureDeLExploitation
      ? TypeDeNatureDeLExploitation.convertirEnValueType(
          natureDeLExploitation.typeNatureDeLExploitation,
        )
      : undefined,
    tauxPrévisionnelACI: natureDeLExploitation?.tauxPrévisionnelACI,

    technologieÉolien: détailCandidature.détail['Technologie (AO éolien)'],
    diamètreRotorEnMètres: détailCandidature.détail['Diamètre du rotor (m) (AO éolien)'],
    hauteurBoutDePâleEnMètres: détailCandidature.détail['Hauteur bout de pâle (m) (AO éolien)'],
    installationRenouvellée: détailCandidature.détail['Installation renouvellée (AO éolien)'],
    nombreDAérogénérateurs: détailCandidature.détail["Nb d'aérogénérateurs (AO éolien)"],
    puissanceUnitaireDesAérogénérateurs:
      détailCandidature.détail['Puissance unitaire des aérogénérateurs (AO éolien)'],
  };
};
