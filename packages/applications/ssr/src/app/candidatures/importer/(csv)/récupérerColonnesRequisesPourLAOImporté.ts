import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { candidatureCsvHeadersMapping } from '@/utils/candidature';

type RécupérerColonnesRequisesPourLAOImporté = ({
  appelOffres,
  periode,
}: {
  appelOffres: string;
  periode: string;
}) => Promise<
  ReadonlyArray<(typeof candidatureCsvHeadersMapping)[keyof typeof candidatureCsvHeadersMapping]>
>;

export const récupérerColonnesRequisesPourLAOImporté: RécupérerColonnesRequisesPourLAOImporté =
  async ({ appelOffres, periode }) => {
    type CandidatureCsvHeadersMappingKeys = (keyof typeof candidatureCsvHeadersMapping)[];

    const détailAppelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: appelOffres },
    });

    if (Option.isNone(détailAppelOffres)) {
      return [];
    }

    // colonnes des champs supplémentaires de l'AO
    const champsSupplémentairesAO = détailAppelOffres.champsSupplémentaires ?? {};
    const champsSupplémentairesPeriode =
      détailAppelOffres.periodes.find((p) => p.id === periode)?.champsSupplémentaires ?? {};

    const champsSupplémentaires = [
      ...new Set([
        ...(Object.keys(champsSupplémentairesAO) as (keyof typeof champsSupplémentairesAO)[]),
        ...(Object.keys(
          champsSupplémentairesPeriode,
        ) as (keyof typeof champsSupplémentairesPeriode)[]),
      ]),
    ];

    const mappingChampSupplémentairesColonnes = {
      autorisationDUrbanisme: ['dateDAutorisationDUrbanisme', 'numéroDAutorisationDUrbanisme'],
      coefficientKChoisi: ['coefficientKChoisi'],
      dispositifDeStockage: [
        'installationAvecDispositifDeStockage',
        'capacitéDuDispositifDeStockageEnKWh',
        'puissanceDuDispositifDeStockageEnKW',
      ],
      installateur: ['installateur'],
      natureDeLExploitation: ['natureDeLExploitation', 'tauxPrévisionnelACI'],
      puissanceALaPointe: ['puissanceALaPointe'],
      puissanceDeSite: ['puissanceDeSite'],
      typologieInstallation: [
        'typeInstallationsAgrivoltaïques',
        'typologieDeBâtiment',
        'obligationDeSolarisation',
        'élémentsSousOmbrière',
      ],
      territoireProjet: ['territoireProjet'],
    } as const satisfies {
      [K in keyof AppelOffre.AppelOffreEntity['champsSupplémentaires']]: CandidatureCsvHeadersMappingKeys;
    };

    const colonnesChampsSupplémentaires: CandidatureCsvHeadersMappingKeys =
      champsSupplémentaires.flatMap((champ) => mappingChampSupplémentairesColonnes[champ]);

    // colonnes communes à tous les AOs (colonnes qui ne correspondent pas à un champ supplémentaire)
    const colonnesSupplémentairesTousAOs: CandidatureCsvHeadersMappingKeys = Object.values(
      mappingChampSupplémentairesColonnes,
    ).flat();

    const colonnesCommunes = (
      Object.keys(candidatureCsvHeadersMapping) as CandidatureCsvHeadersMappingKeys
    ).filter((key) => !colonnesSupplémentairesTousAOs.includes(key));

    // colonnes de l'AO
    return [...colonnesChampsSupplémentaires, ...colonnesCommunes].map(
      (key) => candidatureCsvHeadersMapping[key],
    );
  };
