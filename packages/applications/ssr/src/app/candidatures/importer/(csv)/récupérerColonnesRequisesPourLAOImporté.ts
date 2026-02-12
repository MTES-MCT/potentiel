import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { candidatureCsvHeadersMapping, CandidatureHeaders, CsvHeaders } from '@/utils/candidature';

type RécupérerColonnesRequisesPourLAOImporté = ({
  appelOffres,
  periode,
}: {
  appelOffres: string;
  periode: string;
}) => Promise<CsvHeaders>;

export const récupérerColonnesRequisesPourLAOImporté: RécupérerColonnesRequisesPourLAOImporté =
  async ({ appelOffres, periode }) => {
    const détailAppelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: appelOffres },
    });

    if (Option.isNone(détailAppelOffres)) {
      return [];
    }

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
      [K in AppelOffre.ChampCandidature]: CandidatureHeaders;
    };

    const colonnesChampsSupplémentaires: CandidatureHeaders = champsSupplémentaires.flatMap(
      (champ) => mappingChampSupplémentairesColonnes[champ],
    );

    const toutesColonnesCorrespondantÀDesChampsSupplémentaires: CandidatureHeaders = Object.values(
      mappingChampSupplémentairesColonnes,
    ).flat();

    const colonnesÀTousLesAOs = (
      Object.keys(candidatureCsvHeadersMapping) as CandidatureHeaders
    ).filter((key) => !toutesColonnesCorrespondantÀDesChampsSupplémentaires.includes(key));

    // colonnes de l'AO
    return [...colonnesChampsSupplémentaires, ...colonnesÀTousLesAOs].map(
      (key) => candidatureCsvHeadersMapping[key],
    );
  };
