import assert from 'assert';

import { mediator } from 'mediateur';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Option } from '@potentiel-libraries/monads';

import { candidatureCsvHeadersMapping, CandidatureHeaders, CsvHeaders } from '@/utils/candidature';

type RécupérerColonnesRequisesPourLAOImporté = ({
  appelOffres,
  periode,
}: {
  appelOffres: string | undefined;
  periode: string | undefined;
}) => Promise<CsvHeaders>;

export const récupérerColonnesRequisesPourLAOImporté: RécupérerColonnesRequisesPourLAOImporté =
  async ({ appelOffres, periode }) => {
    let champsSupplémentaires: AppelOffre.ChampCandidature[] = [];
    if (appelOffres && periode) {
      const détailAppelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: { identifiantAppelOffre: appelOffres },
      });
      assert(Option.isSome(détailAppelOffres));

      const champsSupplémentairesAO = détailAppelOffres.champsSupplémentaires ?? {};
      const champsSupplémentairesPeriode =
        détailAppelOffres.periodes.find((p) => p.id === periode)?.champsSupplémentaires ?? {};

      champsSupplémentaires = [
        ...new Set([
          ...(Object.keys(champsSupplémentairesAO) as (keyof typeof champsSupplémentairesAO)[]),
          ...(Object.keys(
            champsSupplémentairesPeriode,
          ) as (keyof typeof champsSupplémentairesPeriode)[]),
        ]),
      ] as AppelOffre.ChampCandidature[];
    }

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

    const colonnesChampsSupplémentaires: CandidatureHeaders = champsSupplémentaires.length
      ? champsSupplémentaires.flatMap((champ) => mappingChampSupplémentairesColonnes[champ])
      : [];

    const toutesColonnesCorrespondantÀUnChampSupplémentaire: CandidatureHeaders = Object.values(
      mappingChampSupplémentairesColonnes,
    ).flat(); // permet de déduire cles colonnes communes à tous les AOs

    const colonnesCommunesÀTousLesAOs = (
      Object.keys(candidatureCsvHeadersMapping) as CandidatureHeaders
    ).filter((key) => !toutesColonnesCorrespondantÀUnChampSupplémentaire.includes(key));

    return [...colonnesChampsSupplémentaires, ...colonnesCommunesÀTousLesAOs].map(
      (key) => candidatureCsvHeadersMapping[key],
    );
  };
