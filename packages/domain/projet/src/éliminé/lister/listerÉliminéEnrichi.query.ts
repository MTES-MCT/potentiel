import { type Message, type MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { type Joined, type List, Where } from '@potentiel-domain/entity';

import {
  type CandidatureEntity,
  type Coordonnées,
  type Dépôt,
  type DétailCandidatureEntity,
  type Localité,
  TypeActionnariat,
  TypologieInstallation,
  UnitéPuissance,
} from '../../candidature/index.js';
import { type GetScopeProjetUtilisateur, IdentifiantProjet } from '../../index.js';
import { DispositifDeStockage } from '../../lauréat/installation/index.js';
import {
  type NatureDeLExploitationEntity,
  TypeDeNatureDeLExploitation,
} from '../../lauréat/nature-de-l-exploitation/index.js';
import type { ÉliminéEntity } from '../éliminé.entity.js';

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

  latitude?: Coordonnées.RawType['latitude'];
  longitude?: Coordonnées.RawType['longitude'];

  actionnaire: string;

  typeActionnariat: TypeActionnariat.ValueType | undefined;

  prixReference: Dépôt.ValueType['prixReference'];
  numéroAutorisation: string | undefined;

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
  tauxPrévisionnelACC: NatureDeLExploitationEntity['tauxPrévisionnelACC'] | undefined;

  technologieÉolien: string | undefined;
  diamètreRotorEnMètres: string | undefined;
  hauteurBoutDePâleEnMètres: string | undefined;
  installationRenouvelée: string | undefined;
  puissanceDuProjetInitial: number | undefined;
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
  getScopeProjetUtilisateur: GetScopeProjetUtilisateur;
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
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur), {
      identifiantProjets: identifiantProjet && [identifiantProjet],
    });

    const éliminés = await list<CandidatureEntity, [ÉliminéEntity, DétailCandidatureEntity]>(
      'candidature',
      {
        orderBy: {
          identifiantProjet: 'ascending',
        },
        where: {
          identifiantProjet: Where.matchAny(scope.identifiantProjets),
          appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
          période: Where.equal(periode),
          famille: Where.equal(famille),
          localité: { région: Where.matchAny(scope.régions) },
          actionnariat: Where.matchAny(
            TypeActionnariat.getTypeActionnariaWhereConditionsForQuery(typeActionnariat),
          ),
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
  autorisation,
  installateur,
  dispositifDeStockage,
  typologieInstallation,
  natureDeLExploitation,
  coordonnées,
  puissanceDuProjetInitial,

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
    ...coordonnées,

    actionnaire: sociétéMère,

    typeActionnariat: actionnariat
      ? TypeActionnariat.convertirEnValueType(actionnariat)
      : undefined,

    prixReference,
    coefficientKChoisi,
    numéroAutorisation: autorisation?.numéro,

    puissance,
    puissanceDeSite,
    unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissance),
    puissanceDuProjetInitial,

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
    tauxPrévisionnelACC: natureDeLExploitation?.tauxPrévisionnelACC,

    technologieÉolien:
      détailCandidature.détail['Technologie (AO éolien)'] ??
      détailCandidature.détail['Technologie'],
    diamètreRotorEnMètres:
      détailCandidature.détail['Diamètre du rotor (m) (AO éolien)'] ??
      détailCandidature.détail['Diamètre du rotor'],
    hauteurBoutDePâleEnMètres:
      détailCandidature.détail['Hauteur bout de pâle (m) (AO éolien)'] ??
      détailCandidature.détail['Hauteur en bout de pale'],
    installationRenouvelée: détailCandidature.détail['Installation renouvellée (AO éolien)']
      ? détailCandidature.détail['Installation renouvellée (AO éolien)']
      : détailCandidature.détail["L'installation est-elle renouvelée ?"] === 'true'
        ? 'Oui'
        : détailCandidature.détail["L'installation est-elle renouvelée ?"] === 'false'
          ? 'Non'
          : undefined,
    nombreDAérogénérateurs:
      détailCandidature.détail["Nb d'aérogénérateurs (AO éolien)"] ??
      détailCandidature.détail["Nombre d'aérogénérateurs"],
    puissanceUnitaireDesAérogénérateurs:
      détailCandidature.détail['Puissance unitaire des aérogénérateurs (AO éolien)'] ??
      détailCandidature.détail['Puissance unitaire des aérogénérateurs'],
  };
};
